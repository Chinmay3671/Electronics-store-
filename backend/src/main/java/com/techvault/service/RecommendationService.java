package com.techvault.service;

import com.techvault.dto.RecommendationRequest;
import com.techvault.dto.RecommendationResponse;

public interface RecommendationService {
    RecommendationResponse getRecommendations(RecommendationRequest request);
}
