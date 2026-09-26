package com.techvault.service.impl;

import com.techvault.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:noreply@techvault.com}")
    private String mailFrom;

    @Async
    @Override
    public void sendWelcomeEmail(String toEmail, String userName) {
        String subject = "Welcome to TechVault Electronics!";
        String body = "Dear " + userName + ",\n\n" +
                "Welcome to TechVault, your premier destination for high-performance electronics, gaming rigs, and cutting-edge tech!\n\n" +
                "Use coupon code WELCOME10 on your first purchase to get 10% off!\n\n" +
                "Best regards,\nTechVault Team";
        sendEmail(toEmail, subject, body);
    }

    @Async
    @Override
    public void sendOrderConfirmationEmail(String toEmail, String userName, String orderNumber, String totalAmount) {
        String subject = "TechVault Order Confirmation - #" + orderNumber;
        String body = "Dear " + userName + ",\n\n" +
                "Thank you for shopping at TechVault! Your order #" + orderNumber + " has been successfully placed.\n\n" +
                "Total Amount: ₹" + totalAmount + "\n\n" +
                "We are currently preparing your shipment. You will receive tracking details once dispatched.\n\n" +
                "Best regards,\nTechVault Support Team";
        sendEmail(toEmail, subject, body);
    }

    @Async
    @Override
    public void sendOrderShippedEmail(String toEmail, String userName, String orderNumber, String trackingNumber, String carrier) {
        String subject = "Your TechVault Order #" + orderNumber + " Has Been Shipped!";
        String body = "Dear " + userName + ",\n\n" +
                "Great news! Your package is on its way via " + carrier + ".\n" +
                "Tracking Number: " + trackingNumber + "\n\n" +
                "You can track your real-time shipment status under your TechVault Orders dashboard.\n\n" +
                "Best regards,\nTechVault Logistics";
        sendEmail(toEmail, subject, body);
    }

    @Async
    @Override
    public void sendOrderDeliveredEmail(String toEmail, String userName, String orderNumber) {
        String subject = "TechVault Order #" + orderNumber + " Delivered!";
        String body = "Dear " + userName + ",\n\n" +
                "Your TechVault order #" + orderNumber + " has been marked as delivered.\n\n" +
                "We hope you enjoy your new tech! Please consider leaving a product review to share your experience with the community.\n\n" +
                "Best regards,\nTechVault Team";
        sendEmail(toEmail, subject, body);
    }

    @Async
    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String subject = "TechVault Password Reset Request";
        String body = "Hello,\n\n" +
                "We received a request to reset your password. Use the following security token to reset your password:\n\n" +
                resetToken + "\n\n" +
                "This token will expire in 24 hours. If you did not request this, please ignore this email.\n\n" +
                "Best regards,\nTechVault Security Team";
        sendEmail(toEmail, subject, body);
    }

    @Async
    @Override
    public void sendLowStockAlertToAdmin(String productName, int currentStock, int threshold) {
        logger.warn("[ADMIN NOTIFICATION] Product '{}' is running low on stock (Remaining: {}, Threshold: {})",
                productName, currentStock, threshold);
    }

    private void sendEmail(String to, String subject, String body) {
        if (!mailEnabled || mailSender == null) {
            logger.info("[MOCK EMAIL SERVICE] To: {} | Subject: {}\n{}", to, subject, body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            logger.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
