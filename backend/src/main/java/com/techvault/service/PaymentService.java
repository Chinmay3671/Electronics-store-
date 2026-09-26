package com.techvault.service;

import com.techvault.dto.PaymentDto;

public interface PaymentService {
    PaymentDto getPaymentByOrderId(Long orderId);
    PaymentDto processMockPayment(Long orderId, String paymentMethod);
}
