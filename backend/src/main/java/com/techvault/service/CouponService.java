package com.techvault.service;

import com.techvault.dto.CouponDto;
import com.techvault.dto.CouponValidationResponse;
import com.techvault.dto.ValidateCouponRequest;

import java.util.List;

public interface CouponService {
    List<CouponDto> getAllCoupons();
    CouponDto createCoupon(CouponDto dto);
    CouponDto updateCoupon(Long id, CouponDto dto);
    void deleteCoupon(Long id);
    CouponValidationResponse validateCoupon(ValidateCouponRequest request);
}
