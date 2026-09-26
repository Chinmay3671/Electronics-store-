package com.techvault.service;

import com.techvault.dto.CreateReviewRequest;
import com.techvault.dto.PagedResponse;
import com.techvault.dto.ReviewDto;

import java.util.List;

public interface ReviewService {
    List<ReviewDto> getProductReviews(Long productId);
    PagedResponse<ReviewDto> getProductReviewsPaged(Long productId, int page, int size);
    ReviewDto createReview(Long productId, CreateReviewRequest request);
    ReviewDto updateReview(Long reviewId, CreateReviewRequest request);
    void deleteReview(Long reviewId);

    // Admin
    PagedResponse<ReviewDto> getAllReviews(String status, int page, int size);
    ReviewDto moderateReview(Long id, String status);
}
