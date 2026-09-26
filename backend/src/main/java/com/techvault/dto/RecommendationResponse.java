package com.techvault.dto;

import java.util.List;

public class RecommendationResponse {

    private boolean success = true;
    private String querySummary;
    private List<RecommendationItemDto> recommendations;
    private Integer totalFound;

    public RecommendationResponse() {}

    public RecommendationResponse(String querySummary, List<RecommendationItemDto> recommendations, Integer totalFound) {
        this.success = true;
        this.querySummary = querySummary;
        this.recommendations = recommendations;
        this.totalFound = totalFound;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getQuerySummary() { return querySummary; }
    public void setQuerySummary(String querySummary) { this.querySummary = querySummary; }

    public List<RecommendationItemDto> getRecommendations() { return recommendations; }
    public void setRecommendations(List<RecommendationItemDto> recommendations) { this.recommendations = recommendations; }

    public Integer getTotalFound() { return totalFound; }
    public void setTotalFound(Integer totalFound) { this.totalFound = totalFound; }
}
