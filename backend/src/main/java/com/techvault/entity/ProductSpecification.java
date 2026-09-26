package com.techvault.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_specifications")
public class ProductSpecification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "spec_group", nullable = false, length = 100)
    private String specGroup = "General";

    @Column(name = "spec_name", nullable = false, length = 100)
    private String specName;

    @Column(name = "spec_value", nullable = false, length = 255)
    private String specValue;

    @Column(name = "is_highlighted")
    private Boolean isHighlighted = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public ProductSpecification() {}

    public ProductSpecification(Product product, String specGroup, String specName, String specValue, Boolean isHighlighted, Integer displayOrder) {
        this.product = product;
        this.specGroup = specGroup;
        this.specName = specName;
        this.specValue = specValue;
        this.isHighlighted = isHighlighted;
        this.displayOrder = displayOrder;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getSpecGroup() { return specGroup; }
    public void setSpecGroup(String specGroup) { this.specGroup = specGroup; }

    public String getSpecName() { return specName; }
    public void setSpecName(String specName) { this.specName = specName; }

    public String getSpecValue() { return specValue; }
    public void setSpecValue(String specValue) { this.specValue = specValue; }

    public Boolean getIsHighlighted() { return isHighlighted; }
    public void setIsHighlighted(Boolean isHighlighted) { this.isHighlighted = isHighlighted; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
