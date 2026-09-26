package com.techvault.controller;

import com.techvault.dto.*;
import com.techvault.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Endpoints for product discovery, filtering, search suggestions, and comparison")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @Operation(summary = "Search and filter products with server-side pagination and sorting")
    public ResponseEntity<PagedResponse<ProductSummaryDto>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) Boolean isTrending,
            @RequestParam(required = false) Boolean isFlashDeal,
            @RequestParam(required = false) Boolean isNewArrival,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "16") int size
    ) {
        PagedResponse<ProductSummaryDto> response = productService.getProducts(
                search, category, brand, minPrice, maxPrice, minRating,
                status, isFeatured, isTrending, isFlashDeal, isNewArrival, sortBy, page, size
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed product information by ID")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok("Product retrieved successfully", product));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get product information by SEO URL slug")
    public ResponseEntity<ApiResponse<ProductDto>> getProductBySlug(@PathVariable String slug) {
        ProductDto product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok("Product retrieved successfully", product));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured showcase products")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getFeaturedProducts() {
        List<ProductSummaryDto> list = productService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.ok("Featured products retrieved", list));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending electronics products")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getTrendingProducts() {
        List<ProductSummaryDto> list = productService.getTrendingProducts();
        return ResponseEntity.ok(ApiResponse.ok("Trending products retrieved", list));
    }

    @GetMapping("/flash-deals")
    @Operation(summary = "Get active flash deal discounts")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getFlashDeals() {
        List<ProductSummaryDto> list = productService.getFlashDeals();
        return ResponseEntity.ok(ApiResponse.ok("Flash deals retrieved", list));
    }

    @GetMapping("/new-arrivals")
    @Operation(summary = "Get newly released hardware and devices")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getNewArrivals() {
        List<ProductSummaryDto> list = productService.getNewArrivals();
        return ResponseEntity.ok(ApiResponse.ok("New arrivals retrieved", list));
    }

    @GetMapping("/suggestions")
    @Operation(summary = "Get instant search autocomplete suggestions")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getSearchSuggestions(@RequestParam String q) {
        List<ProductSummaryDto> list = productService.getSearchSuggestions(q);
        return ResponseEntity.ok(ApiResponse.ok("Suggestions retrieved", list));
    }

    @GetMapping("/compare")
    @Operation(summary = "Compare up to 4 products dynamically across specifications")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getCompareProducts(@RequestParam String ids) {
        List<Long> productIds = Arrays.stream(ids.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::parseLong)
                .collect(Collectors.toList());

        List<ProductDto> list = productService.getCompareProducts(productIds);
        return ResponseEntity.ok(ApiResponse.ok("Comparison products retrieved", list));
    }
}
