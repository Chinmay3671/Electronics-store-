package com.techvault.dto;

import java.util.List;

public class WishlistDto {

    private Long id;
    private List<ProductSummaryDto> products;
    private Integer totalItems;

    public WishlistDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<ProductSummaryDto> getProducts() { return products; }
    public void setProducts(List<ProductSummaryDto> products) { this.products = products; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }
}
