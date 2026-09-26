package com.techvault.dto;

public class ProductSpecificationDto {

    private Long id;
    private String specGroup = "General";
    private String specName;
    private String specValue;
    private Boolean isHighlighted = false;
    private Integer displayOrder = 0;

    public ProductSpecificationDto() {}

    public ProductSpecificationDto(String specGroup, String specName, String specValue, Boolean isHighlighted, Integer displayOrder) {
        this.specGroup = specGroup;
        this.specName = specName;
        this.specValue = specValue;
        this.isHighlighted = isHighlighted;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
