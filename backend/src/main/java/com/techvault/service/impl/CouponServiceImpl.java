package com.techvault.service.impl;

import com.techvault.dto.CouponDto;
import com.techvault.dto.CouponValidationResponse;
import com.techvault.dto.ValidateCouponRequest;
import com.techvault.entity.Coupon;
import com.techvault.entity.User;
import com.techvault.exception.BadRequestException;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.CouponRepository;
import com.techvault.repository.CouponUsageRepository;
import com.techvault.repository.UserRepository;
import com.techvault.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CouponUsageRepository couponUsageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DtoMapper mapper;

    private User getOptionalUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream().map(mapper::toCouponDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CouponDto createCoupon(CouponDto dto) {
        if (couponRepository.existsByCodeIgnoreCase(dto.getCode().trim())) {
            throw new BadRequestException("Coupon with code '" + dto.getCode() + "' already exists");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(dto.getCode().toUpperCase().trim());
        coupon.setDiscountType(dto.getDiscountType() != null ? dto.getDiscountType().toUpperCase() : "PERCENTAGE");
        coupon.setDiscountValue(dto.getDiscountValue());
        coupon.setMinimumOrder(dto.getMinimumOrder() != null ? dto.getMinimumOrder() : BigDecimal.ZERO);
        coupon.setMaximumDiscount(dto.getMaximumDiscount());
        coupon.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDateTime.now());
        coupon.setExpiryDate(dto.getExpiryDate() != null ? dto.getExpiryDate() : LocalDateTime.now().plusMonths(3));
        coupon.setUsageLimit(dto.getUsageLimit() != null ? dto.getUsageLimit() : 1000);
        coupon.setPerUserLimit(dto.getPerUserLimit() != null ? dto.getPerUserLimit() : 1);
        coupon.setActive(dto.getActive() != null ? dto.getActive() : true);

        Coupon saved = couponRepository.save(coupon);
        return mapper.toCouponDto(saved);
    }

    @Override
    @Transactional
    public CouponDto updateCoupon(Long id, CouponDto dto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));

        if (dto.getCode() != null) coupon.setCode(dto.getCode().toUpperCase().trim());
        if (dto.getDiscountType() != null) coupon.setDiscountType(dto.getDiscountType().toUpperCase());
        if (dto.getDiscountValue() != null) coupon.setDiscountValue(dto.getDiscountValue());
        if (dto.getMinimumOrder() != null) coupon.setMinimumOrder(dto.getMinimumOrder());
        if (dto.getMaximumDiscount() != null) coupon.setMaximumDiscount(dto.getMaximumDiscount());
        if (dto.getStartDate() != null) coupon.setStartDate(dto.getStartDate());
        if (dto.getExpiryDate() != null) coupon.setExpiryDate(dto.getExpiryDate());
        if (dto.getUsageLimit() != null) coupon.setUsageLimit(dto.getUsageLimit());
        if (dto.getPerUserLimit() != null) coupon.setPerUserLimit(dto.getPerUserLimit());
        if (dto.getActive() != null) coupon.setActive(dto.getActive());

        Coupon updated = couponRepository.save(coupon);
        return mapper.toCouponDto(updated);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        couponRepository.delete(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(ValidateCouponRequest request) {
        String code = request.getCode().toUpperCase().trim();
        Optional<Coupon> opt = couponRepository.findByCodeIgnoreCase(code);

        if (opt.isEmpty()) {
            return new CouponValidationResponse(false, "Invalid coupon code");
        }

        Coupon coupon = opt.get();
        if (!Boolean.TRUE.equals(coupon.getActive())) {
            return new CouponValidationResponse(false, "This coupon is currently inactive");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartDate()) || now.isAfter(coupon.getExpiryDate())) {
            return new CouponValidationResponse(false, "This coupon has expired or is not yet active");
        }

        if (coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            return new CouponValidationResponse(false, "This coupon has reached its maximum usage limit");
        }

        BigDecimal orderTotal = request.getOrderTotal() != null ? request.getOrderTotal() : BigDecimal.ZERO;
        if (coupon.getMinimumOrder() != null && orderTotal.compareTo(coupon.getMinimumOrder()) < 0) {
            return new CouponValidationResponse(false, "Minimum order amount of ₹" + coupon.getMinimumOrder() + " required for this coupon");
        }

        User user = getOptionalUser();
        if (user != null && coupon.getPerUserLimit() != null) {
            long usedByUser = couponUsageRepository.countByCouponIdAndUserId(coupon.getId(), user.getId());
            if (usedByUser >= coupon.getPerUserLimit()) {
                return new CouponValidationResponse(false, "You have already used this coupon maximum allowed times");
            }
        }

        BigDecimal discountAmount;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = orderTotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaximumDiscount() != null && discountAmount.compareTo(coupon.getMaximumDiscount()) > 0) {
                discountAmount = coupon.getMaximumDiscount();
            }
        } else {
            discountAmount = coupon.getDiscountValue();
            if (discountAmount.compareTo(orderTotal) > 0) {
                discountAmount = orderTotal;
            }
        }

        BigDecimal finalTotal = orderTotal.subtract(discountAmount);
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) finalTotal = BigDecimal.ZERO;

        CouponValidationResponse resp = new CouponValidationResponse(true, "Coupon applied successfully!");
        resp.setCode(coupon.getCode());
        resp.setDiscountType(coupon.getDiscountType());
        resp.setDiscountValue(coupon.getDiscountValue());
        resp.setDiscountAmount(discountAmount);
        resp.setFinalTotal(finalTotal);
        return resp;
    }
}
