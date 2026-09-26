package com.techvault.controller;

import com.techvault.dto.*;
import com.techvault.entity.InventoryLog;
import com.techvault.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Administration dashboard, catalog management, inventory control, and customer analytics")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private CouponService couponService;

    @Autowired
    private ContactService contactService;

    // 1. Dashboard & Analytics
    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard KPI metrics, sales chart, and alerts")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardStats() {
        AdminDashboardDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved", stats));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get deep analytics data")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getAnalytics() {
        AdminDashboardDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Analytics data retrieved", stats));
    }

    // 2. Product Management
    @GetMapping("/products")
    @Operation(summary = "Get paginated products for admin table")
    public ResponseEntity<PagedResponse<ProductSummaryDto>> getAdminProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "15") int size) {
        PagedResponse<ProductSummaryDto> response = productService.getProducts(
                search, category, null, null, null, null,
                status, null, null, null, null, "newest", page, size
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/products")
    @Operation(summary = "Create a new product with specifications and images")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductDto created = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.ok("Product created successfully", created));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update an existing product")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductCreateRequest request) {
        ProductDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", updated));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully"));
    }

    @PutMapping("/products/{id}/stock")
    @Operation(summary = "Adjust product inventory stock")
    public ResponseEntity<ApiResponse<ProductDto>> updateProductStock(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        int quantity = Integer.parseInt(body.get("quantity").toString());
        String changeType = body.getOrDefault("changeType", "RESTOCK").toString();
        String reason = body.getOrDefault("reason", "Admin inventory update").toString();
        ProductDto updated = productService.updateStock(id, quantity, changeType, reason);
        return ResponseEntity.ok(ApiResponse.ok("Stock updated successfully", updated));
    }

    // 3. Order Management
    @GetMapping("/orders")
    @Operation(summary = "Get all customer orders for admin")
    public ResponseEntity<PagedResponse<OrderDto>> getAdminOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "15") int size) {
        PagedResponse<OrderDto> orders = orderService.getAllOrders(status, page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get order details for admin")
    public ResponseEntity<ApiResponse<OrderDto>> getAdminOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok("Order retrieved successfully", order));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order status with tracking details")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderDto updated = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", updated));
    }

    // 4. Customer Management
    @GetMapping("/customers")
    @Operation(summary = "Get list of registered customers")
    public ResponseEntity<PagedResponse<UserDto>> getCustomers(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "15") int size) {
        PagedResponse<UserDto> customers = adminService.getAllCustomers(page, size);
        return ResponseEntity.ok(customers);
    }

    // 5. Inventory Logs
    @GetMapping("/inventory")
    @Operation(summary = "Get inventory transaction audit logs")
    public ResponseEntity<PagedResponse<InventoryLog>> getInventoryLogs(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "15") int size) {
        PagedResponse<InventoryLog> logs = adminService.getInventoryLogs(page, size);
        return ResponseEntity.ok(logs);
    }

    // 6. Review Moderation
    @GetMapping("/reviews")
    @Operation(summary = "Get all customer reviews for moderation")
    public ResponseEntity<PagedResponse<ReviewDto>> getAdminReviews(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "15") int size) {
        PagedResponse<ReviewDto> reviews = reviewService.getAllReviews(status, page, size);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/reviews/{id}/moderate")
    @Operation(summary = "Approve or reject a review")
    public ResponseEntity<ApiResponse<ReviewDto>> moderateReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "APPROVED");
        ReviewDto moderated = reviewService.moderateReview(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Review moderation status updated", moderated));
    }

    // 7. Messages
    @GetMapping("/messages")
    @Operation(summary = "Get customer contact inquiries")
    public ResponseEntity<PagedResponse<ContactMessageDto>> getContactMessages(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "15") int size) {
        PagedResponse<ContactMessageDto> messages = contactService.getAllMessages(status, page, size);
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/messages/{id}/status")
    @Operation(summary = "Update contact message status and add notes")
    public ResponseEntity<ApiResponse<ContactMessageDto>> updateMessageStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMessageStatusRequest request) {
        ContactMessageDto updated = contactService.updateMessageStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Message updated successfully", updated));
    }

    @DeleteMapping("/messages/{id}")
    @Operation(summary = "Delete contact inquiry")
    public ResponseEntity<ApiResponse<Void>> deleteContactMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.ok("Message deleted successfully"));
    }

    // 8. Coupons Management
    @GetMapping("/coupons")
    @Operation(summary = "Get all coupon codes")
    public ResponseEntity<ApiResponse<List<CouponDto>>> getCoupons() {
        List<CouponDto> list = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.ok("Coupons retrieved successfully", list));
    }

    @PostMapping("/coupons")
    @Operation(summary = "Create coupon discount campaign")
    public ResponseEntity<ApiResponse<CouponDto>> createCoupon(@Valid @RequestBody CouponDto dto) {
        CouponDto created = couponService.createCoupon(dto);
        return ResponseEntity.ok(ApiResponse.ok("Coupon created successfully", created));
    }

    @PutMapping("/coupons/{id}")
    @Operation(summary = "Update coupon details")
    public ResponseEntity<ApiResponse<CouponDto>> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponDto dto) {
        CouponDto updated = couponService.updateCoupon(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Coupon updated successfully", updated));
    }

    @DeleteMapping("/coupons/{id}")
    @Operation(summary = "Delete coupon")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.ok("Coupon deleted successfully"));
    }
}
