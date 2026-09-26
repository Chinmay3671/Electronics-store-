package com.techvault.controller;

import com.techvault.dto.ApiResponse;
import com.techvault.dto.CreateReviewRequest;
import com.techvault.dto.PagedResponse;
import com.techvault.dto.ReviewDto;
import com.techvault.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Customer reviews and ratings system")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get all approved reviews for a product")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDto> list = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.ok("Reviews retrieved successfully", list));
    }

    @GetMapping("/product/{productId}/paged")
    @Operation(summary = "Get paginated reviews for a product")
    public ResponseEntity<PagedResponse<ReviewDto>> getProductReviewsPaged(
            @PathVariable Long productId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        PagedResponse<ReviewDto> response = reviewService.getProductReviewsPaged(productId, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/product/{productId}")
    @Operation(summary = "Submit a review for a purchased product")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewDto review = reviewService.createReview(productId, request);
        return ResponseEntity.ok(ApiResponse.ok("Review submitted successfully!", review));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing review")
    public ResponseEntity<ApiResponse<ReviewDto>> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewDto review = reviewService.updateReview(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Review updated successfully", review));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.ok("Review deleted successfully"));
    }
}
