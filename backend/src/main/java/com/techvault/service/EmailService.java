package com.techvault.service;

public interface EmailService {
    void sendWelcomeEmail(String toEmail, String userName);
    void sendOrderConfirmationEmail(String toEmail, String userName, String orderNumber, String totalAmount);
    void sendOrderShippedEmail(String toEmail, String userName, String orderNumber, String trackingNumber, String carrier);
    void sendOrderDeliveredEmail(String toEmail, String userName, String orderNumber);
    void sendPasswordResetEmail(String toEmail, String resetToken);
    void sendLowStockAlertToAdmin(String productName, int currentStock, int threshold);
}
