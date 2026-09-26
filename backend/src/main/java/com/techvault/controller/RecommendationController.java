package com.techvault.controller;

import com.techvault.dto.RecommendationRequest;
import com.techvault.dto.RecommendationResponse;
import com.techvault.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@Tag(name = "Smart Product Finder", description = "Rule-based 'Help Me Choose' smart electronics recommendation engine")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping
    @Operation(summary = "Get tailored electronics recommendations matching budget, usage, specs, and preferences")
    public ResponseEntity<RecommendationResponse> getRecommendations(@RequestBody RecommendationRequest request) {
        RecommendationResponse response = recommendationService.getRecommendations(request);
        return ResponseEntity.ok(response);
    }
}
