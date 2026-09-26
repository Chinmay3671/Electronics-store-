package com.techvault.controller;

import com.techvault.dto.ApiResponse;
import com.techvault.dto.CreateOrderRequest;
import com.techvault.dto.OrderDto;
import com.techvault.dto.PagedResponse;
import com.techvault.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order checkout, history, cancellation, and live tracking")
@SecurityRequirement(name = "BearerAuth")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new order with atomic checkout & inventory deduction")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        OrderDto order = orderService.createOrder(request, sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully!", order));
    }

    @GetMapping
    @Operation(summary = "Get paginated order history for current user")
    public ResponseEntity<PagedResponse<OrderDto>> getUserOrders(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        PagedResponse<OrderDto> orders = orderService.getUserOrders(page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all orders for current user")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getAllUserOrders() {
        List<OrderDto> orders = orderService.getAllUserOrders();
        return ResponseEntity.ok(ApiResponse.ok("Orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details and tracking timeline by ID")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok("Order retrieved successfully", order));
    }

    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get order details and tracking timeline by order number")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderDto order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok("Order retrieved successfully", order));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order and restore inventory")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "Cancelled by customer";
        OrderDto order = orderService.cancelOrder(id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", order));
    }
}
