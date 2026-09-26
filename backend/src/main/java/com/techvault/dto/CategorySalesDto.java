package com.techvault.dto;

import java.math.BigDecimal;

public class CategorySalesDto {

    private String categoryName;
    private BigDecimal totalSales;
    private long unitsSold;
    private int percentage;

    public CategorySalesDto() {}

    public CategorySalesDto(String categoryName, BigDecimal totalSales, long unitsSold, int percentage) {
        this.categoryName = categoryName;
        this.totalSales = totalSales;
        this.unitsSold = unitsSold;
        this.percentage = percentage;
    }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getTotalSales() { return totalSales; }
    public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }

    public long getUnitsSold() { return unitsSold; }
    public void setUnitsSold(long unitsSold) { this.unitsSold = unitsSold; }

    public int getPercentage() { return percentage; }
    public void setPercentage(int percentage) { this.percentage = percentage; }
}
