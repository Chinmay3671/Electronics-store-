package com.techvault.controller;

import com.techvault.dto.ApiResponse;
import com.techvault.dto.PaymentDto;
import com.techvault.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment verification and gateway processing")
@SecurityRequirement(name = "BearerAuth")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payment transaction details for an order")
    public ResponseEntity<ApiResponse<PaymentDto>> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentDto payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok("Payment details retrieved", payment));
    }

    @PostMapping("/process")
    @Operation(summary = "Process mock payment for development/testing")
    public ResponseEntity<ApiResponse<PaymentDto>> processMockPayment(@RequestBody Map<String, Object> body) {
        Long orderId = Long.valueOf(body.get("orderId").toString());
        String method = body.containsKey("paymentMethod") ? body.get("paymentMethod").toString() : "CREDIT_CARD";
        PaymentDto payment = paymentService.processMockPayment(orderId, method);
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", payment));
    }
}
