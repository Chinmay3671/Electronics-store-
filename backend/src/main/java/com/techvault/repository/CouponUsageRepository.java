package com.techvault.repository;

import com.techvault.entity.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    long countByCouponIdAndUserId(Long couponId, Long userId);
    long countByCouponId(Long couponId);
    List<CouponUsage> findByUserId(Long userId);
}
