package com.techvault.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class RecommendationItemDto {

    private Long id;
    private String name;
    private String slug;
    private String mainImage;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer discountPercent;
    private BigDecimal rating;
    private Integer reviewCount;
    private Integer matchScore; // Percentage match: e.g. 95%
    private List<String> matchReasons; // Bullet points explaining why it matches criteria
    private Map<String, String> keySpecs;

    public RecommendationItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getMainImage() { return mainImage; }
    public void setMainImage(String mainImage) { this.mainImage = mainImage; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }

    public List<String> getMatchReasons() { return matchReasons; }
    public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }

    public Map<String, String> getKeySpecs() { return keySpecs; }
    public void setKeySpecs(Map<String, String> keySpecs) { this.keySpecs = keySpecs; }
}
