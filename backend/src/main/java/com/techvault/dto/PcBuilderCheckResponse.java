package com.techvault.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PcBuilderCheckResponse {

    private boolean compatible = true;
    private int estimatedWattage = 0;
    private BigDecimal totalPrice = BigDecimal.ZERO;
    private List<CompatibilityIssue> issues = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();

    public PcBuilderCheckResponse() {}

    public PcBuilderCheckResponse(boolean compatible, int estimatedWattage, BigDecimal totalPrice, List<CompatibilityIssue> issues, List<String> recommendations) {
        this.compatible = compatible;
        this.estimatedWattage = estimatedWattage;
        this.totalPrice = totalPrice;
        this.issues = issues;
        this.recommendations = recommendations;
    }

    public boolean isCompatible() { return compatible; }
    public void setCompatible(boolean compatible) { this.compatible = compatible; }

    public int getEstimatedWattage() { return estimatedWattage; }
    public void setEstimatedWattage(int estimatedWattage) { this.estimatedWattage = estimatedWattage; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public List<CompatibilityIssue> getIssues() { return issues; }
    public void setIssues(List<CompatibilityIssue> issues) { this.issues = issues; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
}
