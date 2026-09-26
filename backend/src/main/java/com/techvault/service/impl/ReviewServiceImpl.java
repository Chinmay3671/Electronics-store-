package com.techvault.service.impl;

import com.techvault.dto.CreateReviewRequest;
import com.techvault.dto.PagedResponse;
import com.techvault.dto.ReviewDto;
import com.techvault.entity.Order;
import com.techvault.entity.Product;
import com.techvault.entity.Review;
import com.techvault.entity.User;
import com.techvault.exception.BadRequestException;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.OrderRepository;
import com.techvault.repository.ProductRepository;
import com.techvault.repository.ReviewRepository;
import com.techvault.repository.UserRepository;
import com.techvault.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DtoMapper mapper;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void updateProductRatingStats(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            Double avg = reviewRepository.calculateAverageRating(productId);
            long count = reviewRepository.countApprovedReviews(productId);
            product.setRating(avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            product.setReviewCount((int) count);
            productRepository.save(product);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, "APPROVED")
                .stream().map(mapper::toReviewDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ReviewDto> getProductReviewsPaged(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Review> reviewPage = reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, "APPROVED", pageable);

        List<ReviewDto> dtos = reviewPage.getContent().stream().map(mapper::toReviewDto).collect(Collectors.toList());
        return new PagedResponse<>(dtos, reviewPage.getNumber(), reviewPage.getSize(), reviewPage.getTotalElements(), reviewPage.getTotalPages(), reviewPage.isLast());
    }

    @Override
    @Transactional
    public ReviewDto createReview(Long productId, CreateReviewRequest request) {
        User user = getAuthenticatedUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (reviewRepository.findByProductIdAndUserId(productId, user.getId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this product");
        }

        // Check if verified purchaser
        List<Order> matchingOrders = orderRepository.findOrdersByUserAndProduct(user.getId(), productId);
        boolean isVerified = !matchingOrders.isEmpty();

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        review.setIsVerifiedPurchase(isVerified);
        review.setStatus("APPROVED"); // Auto-approved for smooth demo, can be moderated

        Review saved = reviewRepository.save(review);
        updateProductRatingStats(productId);

        return mapper.toReviewDto(saved);
    }

    @Override
    @Transactional
    public ReviewDto updateReview(Long reviewId, CreateReviewRequest request) {
        User user = getAuthenticatedUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && !"ROLE_ADMIN".equals(user.getRole())) {
            throw new BadRequestException("You can only edit your own reviews");
        }

        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        Review updated = reviewRepository.save(review);
        updateProductRatingStats(review.getProduct().getId());

        return mapper.toReviewDto(updated);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        User user = getAuthenticatedUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && !"ROLE_ADMIN".equals(user.getRole())) {
            throw new BadRequestException("Unauthorized to delete this review");
        }

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);
        updateProductRatingStats(productId);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ReviewDto> getAllReviews(String status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Review> reviewPage;
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            reviewPage = reviewRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase().trim(), pageable);
        } else {
            reviewPage = reviewRepository.findAll(pageable);
        }

        List<ReviewDto> dtos = reviewPage.getContent().stream().map(mapper::toReviewDto).collect(Collectors.toList());
        return new PagedResponse<>(dtos, reviewPage.getNumber(), reviewPage.getSize(), reviewPage.getTotalElements(), reviewPage.getTotalPages(), reviewPage.isLast());
    }

    @Override
    @Transactional
    public ReviewDto moderateReview(Long id, String status) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setStatus(status.toUpperCase().trim());
        Review saved = reviewRepository.save(review);
        updateProductRatingStats(review.getProduct().getId());
        return mapper.toReviewDto(saved);
    }
}
