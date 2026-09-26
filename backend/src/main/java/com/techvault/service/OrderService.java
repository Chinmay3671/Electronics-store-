package com.techvault.service;

import com.techvault.dto.*;

import java.util.List;

public interface OrderService {
    OrderDto createOrder(CreateOrderRequest request, String sessionId);
    PagedResponse<OrderDto> getUserOrders(int page, int size);
    List<OrderDto> getAllUserOrders();
    OrderDto getOrderById(Long id);
    OrderDto getOrderByNumber(String orderNumber);
    OrderDto cancelOrder(Long id, String reason);

    // Admin
    PagedResponse<OrderDto> getAllOrders(String status, int page, int size);
    OrderDto updateOrderStatus(Long id, OrderStatusUpdateRequest request);
}
