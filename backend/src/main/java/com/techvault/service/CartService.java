package com.techvault.service;

import com.techvault.dto.AddToCartRequest;
import com.techvault.dto.CartDto;
import com.techvault.dto.UpdateCartItemRequest;

public interface CartService {
    CartDto getCart(String sessionId);
    CartDto addToCart(AddToCartRequest request, String sessionId);
    CartDto updateCartItem(Long itemId, UpdateCartItemRequest request, String sessionId);
    CartDto removeCartItem(Long itemId, String sessionId);
    void clearCart(String sessionId);
}
