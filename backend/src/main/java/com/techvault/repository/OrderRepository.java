package com.techvault.repository;

import com.techvault.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Order> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.createdAt >= :startDate")
    BigDecimal calculateRevenueSince(@Param("startDate") LocalDateTime startDate);

    long countByStatus(String status);
    long countByPaymentStatus(String paymentStatus);

    @Query("SELECT COUNT(DISTINCT o.user.id) FROM Order o")
    long countDistinctCustomers();

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND EXISTS (SELECT oi FROM OrderItem oi WHERE oi.order.id = o.id AND oi.product.id = :productId)")
    List<Order> findOrdersByUserAndProduct(@Param("userId") Long userId, @Param("productId") Long productId);
}
