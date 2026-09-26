package com.techvault.controller;

import com.techvault.dto.ApiResponse;
import com.techvault.dto.CouponDto;
import com.techvault.dto.CouponValidationResponse;
import com.techvault.dto.ValidateCouponRequest;
import com.techvault.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@Tag(name = "Coupons", description = "Discount codes validation and promotional campaigns")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/validate")
    @Operation(summary = "Validate coupon code against order cart amount")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> validateCoupon(@Valid @RequestBody ValidateCouponRequest request) {
        CouponValidationResponse response = couponService.validateCoupon(request);
        return ResponseEntity.ok(ApiResponse.ok("Coupon validated", response));
    }

    @GetMapping("/active")
    @Operation(summary = "Get list of publicly available coupons")
    public ResponseEntity<ApiResponse<List<CouponDto>>> getActiveCoupons() {
        List<CouponDto> list = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.ok("Active coupons retrieved", list));
    }
}
