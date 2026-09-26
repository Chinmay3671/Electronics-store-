package com.techvault.service;

import com.techvault.dto.WishlistDto;

public interface WishlistService {
    WishlistDto getWishlist();
    WishlistDto addToWishlist(Long productId);
    WishlistDto removeFromWishlist(Long productId);
    WishlistDto moveToCart(Long productId, String sessionId);
}
