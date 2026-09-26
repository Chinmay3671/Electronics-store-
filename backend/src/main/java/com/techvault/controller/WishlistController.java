package com.techvault.controller;

import com.techvault.dto.ApiResponse;
import com.techvault.dto.WishlistDto;
import com.techvault.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "Customer wishlist management")
@SecurityRequirement(name = "BearerAuth")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get current user wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> getWishlist() {
        WishlistDto wishlist = wishlistService.getWishlist();
        return ResponseEntity.ok(ApiResponse.ok("Wishlist retrieved successfully", wishlist));
    }

    @PostMapping("/{productId}")
    @Operation(summary = "Add a product to user wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> addToWishlist(@PathVariable Long productId) {
        WishlistDto wishlist = wishlistService.addToWishlist(productId);
        return ResponseEntity.ok(ApiResponse.ok("Product added to wishlist", wishlist));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> removeFromWishlist(@PathVariable Long productId) {
        WishlistDto wishlist = wishlistService.removeFromWishlist(productId);
        return ResponseEntity.ok(ApiResponse.ok("Product removed from wishlist", wishlist));
    }

    @PostMapping("/{productId}/move-to-cart")
    @Operation(summary = "Move product from wishlist to cart")
    public ResponseEntity<ApiResponse<WishlistDto>> moveToCart(
            @PathVariable Long productId,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        WishlistDto wishlist = wishlistService.moveToCart(productId, sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Product moved to cart", wishlist));
    }
}
