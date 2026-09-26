package com.techvault.dto;

import java.math.BigDecimal;

public class MonthlySalesDto {

    private String label; // e.g. "Jan", "Week 1", "Day 1"
    private BigDecimal revenue;
    private long orderCount;

    public MonthlySalesDto() {}

    public MonthlySalesDto(String label, BigDecimal revenue, long orderCount) {
        this.label = label;
        this.revenue = revenue;
        this.orderCount = orderCount;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public long getOrderCount() { return orderCount; }
    public void setOrderCount(long orderCount) { this.orderCount = orderCount; }
}
