package com.techvault.service.impl;

import com.techvault.dto.AddToCartRequest;
import com.techvault.dto.ProductSummaryDto;
import com.techvault.dto.WishlistDto;
import com.techvault.entity.Product;
import com.techvault.entity.User;
import com.techvault.entity.Wishlist;
import com.techvault.entity.WishlistItem;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.ProductRepository;
import com.techvault.repository.UserRepository;
import com.techvault.repository.WishlistItemRepository;
import com.techvault.repository.WishlistRepository;
import com.techvault.service.CartService;
import com.techvault.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private DtoMapper mapper;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wishlist w = new Wishlist(user);
                    return wishlistRepository.save(w);
                });
    }

    private WishlistDto buildWishlistDto(Wishlist wishlist) {
        WishlistDto dto = new WishlistDto();
        dto.setId(wishlist.getId());
        List<WishlistItem> items = wishlistItemRepository.findByWishlistId(wishlist.getId());
        List<ProductSummaryDto> productDtos = items.stream()
                .map(item -> mapper.toProductSummaryDto(item.getProduct()))
                .collect(Collectors.toList());
        dto.setProducts(productDtos);
        dto.setTotalItems(productDtos.size());
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistDto getWishlist() {
        User user = getAuthenticatedUser();
        Wishlist wishlist = getOrCreateWishlist(user);
        return buildWishlistDto(wishlist);
    }

    @Override
    @Transactional
    public WishlistDto addToWishlist(Long productId) {
        User user = getAuthenticatedUser();
        Wishlist wishlist = getOrCreateWishlist(user);

        if (!wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlistItemRepository.save(item);
        }

        return buildWishlistDto(wishlist);
    }

    @Override
    @Transactional
    public WishlistDto removeFromWishlist(Long productId) {
        User user = getAuthenticatedUser();
        Wishlist wishlist = getOrCreateWishlist(user);
        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
        return buildWishlistDto(wishlist);
    }

    @Override
    @Transactional
    public WishlistDto moveToCart(Long productId, String sessionId) {
        User user = getAuthenticatedUser();
        Wishlist wishlist = getOrCreateWishlist(user);

        // Add to cart
        cartService.addToCart(new AddToCartRequest(productId, 1), sessionId);

        // Remove from wishlist
        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);

        return buildWishlistDto(wishlist);
    }
}
