package com.techvault.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductSummaryDto {

    private Long id;
    private String name;
    private String slug;
    private String sku;
    private String shortDescription;
    private String brandName;
    private String brandSlug;
    private String categoryName;
    private String categorySlug;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer discountPercent;
    private Integer stock;
    private String status;
    private BigDecimal rating;
    private Integer reviewCount;
    private String mainImage;
    private Boolean isFeatured;
    private Boolean isTrending;
    private Boolean isFlashDeal;
    private Boolean isNewArrival;
    private List<ProductSpecificationDto> highlightedSpecs;

    public ProductSummaryDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public String getBrandSlug() { return brandSlug; }
    public void setBrandSlug(String brandSlug) { this.brandSlug = brandSlug; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getMainImage() { return mainImage; }
    public void setMainImage(String mainImage) { this.mainImage = mainImage; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }

    public Boolean getIsFlashDeal() { return isFlashDeal; }
    public void setIsFlashDeal(Boolean isFlashDeal) { this.isFlashDeal = isFlashDeal; }

    public Boolean getIsNewArrival() { return isNewArrival; }
    public void setIsNewArrival(Boolean isNewArrival) { this.isNewArrival = isNewArrival; }

    public List<ProductSpecificationDto> getHighlightedSpecs() { return highlightedSpecs; }
    public void setHighlightedSpecs(List<ProductSpecificationDto> highlightedSpecs) { this.highlightedSpecs = highlightedSpecs; }
}
