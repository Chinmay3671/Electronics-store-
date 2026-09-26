package com.techvault.controller;

import com.techvault.dto.AddToCartRequest;
import com.techvault.dto.ApiResponse;
import com.techvault.dto.CartDto;
import com.techvault.dto.UpdateCartItemRequest;
import com.techvault.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "Shopping cart persistent storage and operations")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    @Operation(summary = "Get user or guest cart details")
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        CartDto cart = cartService.getCart(sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Cart retrieved successfully", cart));
    }

    @PostMapping("/items")
    @Operation(summary = "Add a product item to cart")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        CartDto cart = cartService.addToCart(request, sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", cart));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update quantity of a cart item")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        CartDto cart = cartService.updateCartItem(itemId, request, sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Cart updated successfully", cart));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartDto>> removeCartItem(
            @PathVariable Long itemId,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        CartDto cart = cartService.removeCartItem(itemId, sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", cart));
    }

    @DeleteMapping
    @Operation(summary = "Clear all items from cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        cartService.clearCart(sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared successfully"));
    }
}
