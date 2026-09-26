package com.techvault.service.impl;

import com.techvault.dto.PaymentDto;
import com.techvault.entity.Order;
import com.techvault.entity.Payment;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.OrderRepository;
import com.techvault.repository.PaymentRepository;
import com.techvault.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public PaymentDto getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order: " + orderId));
        return mapper.toPaymentDto(payment);
    }

    @Override
    @Transactional
    public PaymentDto processMockPayment(Long orderId, String paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        Payment payment = paymentRepository.findByOrderId(orderId).orElseGet(() -> {
            Payment p = new Payment();
            p.setOrder(order);
            p.setUser(order.getUser());
            p.setAmount(order.getTotalAmount());
            p.setProvider("TECHVAULT_GATEWAY");
            return p;
        });

        payment.setTransactionId("TXN_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase());
        payment.setStatus("SUCCESS");
        payment.setPaymentMethod(paymentMethod != null ? paymentMethod : "CREDIT_CARD");
        payment.setGatewayResponse("{\"status\":\"captured\",\"timestamp\":\"" + System.currentTimeMillis() + "\"}");

        Payment saved = paymentRepository.save(payment);

        order.setPaymentStatus("PAID");
        orderRepository.save(order);

        return mapper.toPaymentDto(saved);
    }
}
