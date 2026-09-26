package com.techvault.service;

import com.techvault.dto.*;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    PagedResponse<ProductSummaryDto> getProducts(
            String search,
            String categorySlug,
            String brandSlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            String status,
            Boolean isFeatured,
            Boolean isTrending,
            Boolean isFlashDeal,
            Boolean isNewArrival,
            String sortBy,
            int page,
            int size
    );

    ProductDto getProductById(Long id);
    ProductDto getProductBySlug(String slug);
    List<ProductSummaryDto> getFeaturedProducts();
    List<ProductSummaryDto> getTrendingProducts();
    List<ProductSummaryDto> getFlashDeals();
    List<ProductSummaryDto> getNewArrivals();
    List<ProductSummaryDto> getSearchSuggestions(String query);
    List<ProductDto> getCompareProducts(List<Long> productIds);

    ProductDto createProduct(ProductCreateRequest request);
    ProductDto updateProduct(Long id, ProductCreateRequest request);
    void deleteProduct(Long id);
    ProductDto updateStock(Long id, int quantity, String changeType, String reason);
}
