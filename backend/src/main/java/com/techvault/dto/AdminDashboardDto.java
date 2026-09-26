package com.techvault.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardDto {

    private BigDecimal totalRevenue;
    private long totalOrders;
    private long totalCustomers;
    private long totalProducts;
    private long lowStockProducts;
    private long outOfStockProducts;
    private long pendingOrders;
    private long newMessages;

    private List<OrderDto> recentOrders;
    private List<ProductSummaryDto> lowStockAlerts;
    private List<MonthlySalesDto> revenueChart;
    private List<CategorySalesDto> categorySales;

    public AdminDashboardDto() {}

    // Getters and Setters
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getLowStockProducts() { return lowStockProducts; }
    public void setLowStockProducts(long lowStockProducts) { this.lowStockProducts = lowStockProducts; }

    public long getOutOfStockProducts() { return outOfStockProducts; }
    public void setOutOfStockProducts(long outOfStockProducts) { this.outOfStockProducts = outOfStockProducts; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getNewMessages() { return newMessages; }
    public void setNewMessages(long newMessages) { this.newMessages = newMessages; }

    public List<OrderDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDto> recentOrders) { this.recentOrders = recentOrders; }

    public List<ProductSummaryDto> getLowStockAlerts() { return lowStockAlerts; }
    public void setLowStockAlerts(List<ProductSummaryDto> lowStockAlerts) { this.lowStockAlerts = lowStockAlerts; }

    public List<MonthlySalesDto> getRevenueChart() { return revenueChart; }
    public void setRevenueChart(List<MonthlySalesDto> revenueChart) { this.revenueChart = revenueChart; }

    public List<CategorySalesDto> getCategorySales() { return categorySales; }
    public void setCategorySales(List<CategorySalesDto> categorySales) { this.categorySales = categorySales; }
}
