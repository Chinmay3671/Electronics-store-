package com.techvault.service.impl;

import com.techvault.dto.AddToCartRequest;
import com.techvault.dto.CartDto;
import com.techvault.dto.UpdateCartItemRequest;
import com.techvault.entity.Cart;
import com.techvault.entity.CartItem;
import com.techvault.entity.Product;
import com.techvault.entity.User;
import com.techvault.exception.BadRequestException;
import com.techvault.exception.InsufficientStockException;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.CartItemRepository;
import com.techvault.repository.CartRepository;
import com.techvault.repository.ProductRepository;
import com.techvault.repository.UserRepository;
import com.techvault.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DtoMapper mapper;

    private User getOptionalAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }

    private Cart getOrCreateCart(String sessionId) {
        User user = getOptionalAuthenticatedUser();
        if (user != null) {
            return cartRepository.findByUserId(user.getId())
                    .orElseGet(() -> {
                        Cart newCart = new Cart(user);
                        return cartRepository.save(newCart);
                    });
        }

        if (sessionId == null || sessionId.trim().isEmpty()) {
            sessionId = "guest-" + java.util.UUID.randomUUID().toString();
        }

        final String finalSessionId = sessionId;
        return cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setSessionId(finalSessionId);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    @Transactional
    public CartDto getCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        return mapper.toCartDto(cart);
    }

    @Override
    @Transactional
    public CartDto addToCart(AddToCartRequest request, String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() <= 0) {
            throw new InsufficientStockException("Product '" + product.getName() + "' is currently out of stock");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStock()) {
                throw new InsufficientStockException("Only " + product.getStock() + " units available in stock");
            }
            item.setQuantity(newQuantity);
            item.setUnitPrice(product.getSalePrice());
            cartItemRepository.save(item);
        } else {
            if (request.getQuantity() > product.getStock()) {
                throw new InsufficientStockException("Only " + product.getStock() + " units available in stock");
            }
            CartItem newItem = new CartItem(cart, product, request.getQuantity(), product.getSalePrice());
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return mapper.toCartDto(updatedCart);
    }

    @Override
    @Transactional
    public CartDto updateCartItem(Long itemId, UpdateCartItemRequest request, String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        if (request.getQuantity() <= 0) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            Product product = item.getProduct();
            if (request.getQuantity() > product.getStock()) {
                throw new InsufficientStockException("Requested quantity exceeds available stock (" + product.getStock() + ")");
            }
            item.setQuantity(request.getQuantity());
            item.setUnitPrice(product.getSalePrice());
            cartItemRepository.save(item);
        }

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return mapper.toCartDto(updatedCart);
    }

    @Override
    @Transactional
    public CartDto removeCartItem(Long itemId, String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        cart.removeItem(item);
        cartItemRepository.delete(item);

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return mapper.toCartDto(updatedCart);
    }

    @Override
    @Transactional
    public void clearCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        cartItemRepository.deleteByCartId(cart.getId());
        cart.clearItems();
        cartRepository.save(cart);
    }
}
