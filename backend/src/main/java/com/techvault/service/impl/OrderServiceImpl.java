package com.techvault.service.impl;

import com.techvault.dto.*;
import com.techvault.entity.*;
import com.techvault.exception.BadRequestException;
import com.techvault.exception.InsufficientStockException;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.*;
import com.techvault.service.CartService;
import com.techvault.service.CouponService;
import com.techvault.service.EmailService;
import com.techvault.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CouponUsageRepository couponUsageRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CouponService couponService;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private DtoMapper mapper;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomNum = 10000 + new Random().nextInt(90000);
        return "ORD-" + timestamp + "-" + randomNum;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderDto createOrder(CreateOrderRequest request, String sessionId) {
        User user = getAuthenticatedUser();

        Address address = addressRepository.findByIdAndUserId(request.getAddressId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery address not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cannot create order with an empty cart");
        }

        // 1. Calculate subtotal & Validate stock atomically
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            if (product.getStock() < item.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for product '" + product.getName() +
                        "'. Available: " + product.getStock() + ", requested: " + item.getQuantity());
            }

            BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        // 2. Coupon validation & discount
        BigDecimal discountAmount = BigDecimal.ZERO;
        String appliedCouponCode = null;
        Coupon usedCoupon = null;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            CouponValidationResponse cResp = couponService.validateCoupon(
                    new ValidateCouponRequest(request.getCouponCode(), subtotal)
            );
            if (cResp.isValid()) {
                discountAmount = cResp.getDiscountAmount();
                appliedCouponCode = cResp.getCode();
                usedCoupon = couponRepository.findByCodeIgnoreCase(appliedCouponCode).orElse(null);
            }
        }

        // 3. Tax & Shipping calculation
        BigDecimal taxAmount = subtotal.subtract(discountAmount).multiply(BigDecimal.valueOf(0.18)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal shippingFee = (subtotal.compareTo(BigDecimal.valueOf(1000)) > 0) ? BigDecimal.ZERO : BigDecimal.valueOf(150);
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(taxAmount).add(shippingFee);

        // 4. Create Order Entity
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setAddress(address);
        order.setShippingFullName(address.getFullName());
        order.setShippingPhone(address.getPhone());
        order.setShippingAddressLine(address.getAddressLine());
        order.setShippingCity(address.getCity());
        order.setShippingState(address.getState());
        order.setShippingPincode(address.getPincode());
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setTaxAmount(taxAmount);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setStatus("CONFIRMED");
        order.setPaymentStatus("PAID"); // Mock successful immediate payment
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD");
        order.setCouponCode(appliedCouponCode);
        order.setTrackingNumber("TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCarrierName("BlueDart Express");
        order.setEstimatedDelivery(LocalDateTime.now().plusDays(3));
        order.setNotes(request.getNotes());

        Order savedOrder = orderRepository.save(order);

        // 5. Create Order Items & Decrement Inventory Transactionally
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            int previousStock = product.getStock();
            int newStock = previousStock - item.getQuantity();

            product.setStock(newStock);
            product.calculateStockStatus();
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    product,
                    product.getName(),
                    product.getMainImage(),
                    product.getSku(),
                    item.getUnitPrice(),
                    item.getQuantity(),
                    item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
            );
            orderItemRepository.save(orderItem);
            savedOrder.addItem(orderItem);

            // Log Inventory reduction
            InventoryLog invLog = new InventoryLog(
                    product,
                    "PURCHASE",
                    item.getQuantity(),
                    previousStock,
                    newStock,
                    savedOrder.getOrderNumber(),
                    "Order purchase #" + savedOrder.getOrderNumber()
            );
            inventoryLogRepository.save(invLog);

            // Check if product hit low stock
            if (newStock <= product.getLowStockThreshold()) {
                emailService.sendLowStockAlertToAdmin(product.getName(), newStock, product.getLowStockThreshold());
            }
        }

        // 6. Create Payment Record
        Payment payment = new Payment(
                savedOrder,
                user,
                totalAmount,
                "TECHVAULT_GATEWAY",
                "TXN_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase(),
                "SUCCESS",
                order.getPaymentMethod()
        );
        payment.setGatewayResponse("{\"status\":\"success\",\"auth_code\":\"TV_AUTH_" + System.currentTimeMillis() + "\"}");
        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        // 7. Track Coupon Usage
        if (usedCoupon != null) {
            usedCoupon.setTimesUsed(usedCoupon.getTimesUsed() + 1);
            couponRepository.save(usedCoupon);

            CouponUsage usage = new CouponUsage(usedCoupon, user, savedOrder);
            couponUsageRepository.save(usage);
        }

        // 8. Clear Cart
        cartService.clearCart(sessionId);

        // 9. Create User In-App Notification
        Notification notif = new Notification(
                user,
                "Order Placed Successfully! #" + savedOrder.getOrderNumber(),
                "Your order for " + savedOrder.getItems().size() + " items has been confirmed. Total: ₹" + savedOrder.getTotalAmount(),
                "ORDER_UPDATE",
                "/orders/" + savedOrder.getId()
        );
        notificationRepository.save(notif);

        // 10. Send Confirmation Email
        emailService.sendOrderConfirmationEmail(user.getEmail(), user.getName(), savedOrder.getOrderNumber(), savedOrder.getTotalAmount().toString());

        return mapper.toOrderDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderDto> getUserOrders(int page, int size) {
        User user = getAuthenticatedUser();
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        List<OrderDto> dtos = orderPage.getContent().stream().map(mapper::toOrderDto).collect(Collectors.toList());
        return new PagedResponse<>(dtos, orderPage.getNumber(), orderPage.getSize(), orderPage.getTotalElements(), orderPage.getTotalPages(), orderPage.isLast());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getAllUserOrders() {
        User user = getAuthenticatedUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(mapper::toOrderDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id) {
        User user = getAuthenticatedUser();
        Order order;
        if ("ROLE_ADMIN".equals(user.getRole())) {
            order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        } else {
            order = orderRepository.findByIdAndUserId(id, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        }
        return mapper.toOrderDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
        return mapper.toOrderDto(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderDto cancelOrder(Long id, String reason) {
        User user = getAuthenticatedUser();
        Order order;
        if ("ROLE_ADMIN".equals(user.getRole())) {
            order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        } else {
            order = orderRepository.findByIdAndUserId(id, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        }

        if ("DELIVERED".equals(order.getStatus()) || "CANCELLED".equals(order.getStatus())) {
            throw new BadRequestException("Cannot cancel an order that is already " + order.getStatus().toLowerCase());
        }

        order.setStatus("CANCELLED");
        order.setPaymentStatus("REFUNDED");
        order.setNotes((order.getNotes() != null ? order.getNotes() + " | " : "") + "Cancelled: " + reason);
        Order updatedOrder = orderRepository.save(order);

        // Restore stock transactionally
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            int prevStock = product.getStock();
            int newStock = prevStock + item.getQuantity();
            product.setStock(newStock);
            product.calculateStockStatus();
            productRepository.save(product);

            InventoryLog invLog = new InventoryLog(
                    product,
                    "CANCEL_RESTORE",
                    item.getQuantity(),
                    prevStock,
                    newStock,
                    order.getOrderNumber(),
                    "Order cancelled restore"
            );
            inventoryLogRepository.save(invLog);
        }

        Notification notif = new Notification(
                order.getUser(),
                "Order #" + order.getOrderNumber() + " Cancelled",
                "Your order #" + order.getOrderNumber() + " has been cancelled. Refund will be processed within 3-5 business days.",
                "ORDER_UPDATE",
                "/orders/" + order.getId()
        );
        notificationRepository.save(notif);

        return mapper.toOrderDto(updatedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderDto> getAllOrders(String status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage;
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            orderPage = orderRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase().trim(), pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        List<OrderDto> dtos = orderPage.getContent().stream().map(mapper::toOrderDto).collect(Collectors.toList());
        return new PagedResponse<>(dtos, orderPage.getNumber(), orderPage.getSize(), orderPage.getTotalElements(), orderPage.getTotalPages(), orderPage.isLast());
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        String targetStatus = request.getStatus().toUpperCase().trim();
        String currentStatus = order.getStatus();

        // Validate allowed status transitions (Section 58)
        validateStatusTransition(currentStatus, targetStatus);

        order.setStatus(targetStatus);
        if (request.getTrackingNumber() != null) order.setTrackingNumber(request.getTrackingNumber());
        if (request.getCarrierName() != null) order.setCarrierName(request.getCarrierName());
        if (request.getNotes() != null) order.setNotes(request.getNotes());

        if ("SHIPPED".equals(targetStatus)) {
            emailService.sendOrderShippedEmail(
                    order.getUser().getEmail(),
                    order.getUser().getName(),
                    order.getOrderNumber(),
                    order.getTrackingNumber() != null ? order.getTrackingNumber() : "N/A",
                    order.getCarrierName() != null ? order.getCarrierName() : "Standard Carrier"
            );
        } else if ("DELIVERED".equals(targetStatus)) {
            emailService.sendOrderDeliveredEmail(order.getUser().getEmail(), order.getUser().getName(), order.getOrderNumber());
        }

        Notification notif = new Notification(
                order.getUser(),
                "Order Status Update: " + targetStatus,
                "Your order #" + order.getOrderNumber() + " status is now " + targetStatus + ".",
                "ORDER_UPDATE",
                "/orders/" + order.getId()
        );
        notificationRepository.save(notif);

        Order saved = orderRepository.save(order);
        return mapper.toOrderDto(saved);
    }

    private void validateStatusTransition(String from, String to) {
        if (from.equals(to)) return;
        if ("CANCELLED".equals(from)) {
            throw new BadRequestException("Cannot modify a cancelled order");
        }
        if ("DELIVERED".equals(from) && !"CANCELLED".equals(to)) {
            throw new BadRequestException("Delivered orders can only be refunded/cancelled");
        }
    }
}
