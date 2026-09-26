package com.techvault.mapper;

import com.techvault.dto.*;
import com.techvault.entity.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DtoMapper {

    public UserDto toUserDto(User user) {
        if (user == null) return null;
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getAvatarUrl(),
                user.getCreatedAt()
        );
    }

    public AddressDto toAddressDto(Address address) {
        if (address == null) return null;
        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setFullName(address.getFullName());
        dto.setPhone(address.getPhone());
        dto.setAddressLine(address.getAddressLine());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPincode(address.getPincode());
        dto.setLandmark(address.getLandmark());
        dto.setAddressType(address.getAddressType());
        dto.setIsDefault(address.getIsDefault());
        return dto;
    }

    public BrandDto toBrandDto(Brand brand) {
        if (brand == null) return null;
        BrandDto dto = new BrandDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setSlug(brand.getSlug());
        dto.setLogoUrl(brand.getLogoUrl());
        dto.setDescription(brand.getDescription());
        dto.setWebsite(brand.getWebsite());
        dto.setActive(brand.getActive());
        return dto;
    }

    public CategoryDto toCategoryDto(Category category) {
        if (category == null) return null;
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        dto.setIcon(category.getIcon());
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
        }
        dto.setDisplayOrder(category.getDisplayOrder());
        dto.setActive(category.getActive());
        return dto;
    }

    public ProductSpecificationDto toSpecDto(ProductSpecification spec) {
        if (spec == null) return null;
        return new ProductSpecificationDto(
                spec.getSpecGroup(),
                spec.getSpecName(),
                spec.getSpecValue(),
                spec.getIsHighlighted(),
                spec.getDisplayOrder()
        );
    }

    public ProductImageDto toImageDto(ProductImage image) {
        if (image == null) return null;
        return new ProductImageDto(
                image.getId(),
                image.getImageUrl(),
                image.getAltText(),
                image.getDisplayOrder(),
                image.getIsPrimary()
        );
    }

    public ProductSummaryDto toProductSummaryDto(Product product) {
        if (product == null) return null;
        ProductSummaryDto dto = new ProductSummaryDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setSku(product.getSku());
        dto.setShortDescription(product.getShortDescription());
        if (product.getBrand() != null) {
            dto.setBrandName(product.getBrand().getName());
            dto.setBrandSlug(product.getBrand().getSlug());
        }
        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
            dto.setCategorySlug(product.getCategory().getSlug());
        }
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setSalePrice(product.getSalePrice());
        dto.setDiscountPercent(product.getDiscountPercent());
        dto.setStock(product.getStock());
        dto.setStatus(product.getStatus());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setMainImage(product.getMainImage());
        dto.setIsFeatured(product.getIsFeatured());
        dto.setIsTrending(product.getIsTrending());
        dto.setIsFlashDeal(product.getIsFlashDeal());
        dto.setIsNewArrival(product.getIsNewArrival());

        if (product.getSpecifications() != null) {
            List<ProductSpecificationDto> highlighted = product.getSpecifications().stream()
                    .filter(s -> Boolean.TRUE.equals(s.getIsHighlighted()))
                    .map(this::toSpecDto)
                    .collect(Collectors.toList());
            dto.setHighlightedSpecs(highlighted);
        }

        return dto;
    }

    public ProductDto toProductDto(Product product) {
        if (product == null) return null;
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setSku(product.getSku());
        dto.setShortDescription(product.getShortDescription());
        dto.setDescription(product.getDescription());
        dto.setBrand(toBrandDto(product.getBrand()));
        dto.setCategory(toCategoryDto(product.getCategory()));
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setSalePrice(product.getSalePrice());
        dto.setDiscountPercent(product.getDiscountPercent());
        dto.setStock(product.getStock());
        dto.setReservedStock(product.getReservedStock());
        dto.setLowStockThreshold(product.getLowStockThreshold());
        dto.setStatus(product.getStatus());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setWarranty(product.getWarranty());
        dto.setWhatsInBox(product.getWhatsInBox());
        dto.setMainImage(product.getMainImage());
        dto.setIsFeatured(product.getIsFeatured());
        dto.setIsTrending(product.getIsTrending());
        dto.setIsFlashDeal(product.getIsFlashDeal());
        dto.setIsNewArrival(product.getIsNewArrival());

        if (product.getImages() != null) {
            dto.setImages(product.getImages().stream().map(this::toImageDto).collect(Collectors.toList()));
        }
        if (product.getSpecifications() != null) {
            dto.setSpecifications(product.getSpecifications().stream().map(this::toSpecDto).collect(Collectors.toList()));
        }

        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }

    public CartItemDto toCartItemDto(CartItem item) {
        if (item == null) return null;
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        Product product = item.getProduct();
        if (product != null) {
            dto.setProductId(product.getId());
            dto.setProductName(product.getName());
            dto.setProductSlug(product.getSlug());
            dto.setProductImage(product.getMainImage());
            dto.setSku(product.getSku());
            dto.setAvailableStock(product.getStock());
            dto.setInStock(product.getStock() > 0 && product.getStock() >= item.getQuantity());
        }
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        return dto;
    }

    public CartDto toCartDto(Cart cart) {
        if (cart == null) return null;
        CartDto dto = new CartDto();
        dto.setId(cart.getId());

        List<CartItemDto> itemDtos = cart.getItems() != null
                ? cart.getItems().stream().map(this::toCartItemDto).collect(Collectors.toList())
                : Collections.emptyList();

        dto.setItems(itemDtos);

        BigDecimal subtotal = itemDtos.stream()
                .map(CartItemDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setSubtotal(subtotal);
        // Tax estimated at 18% GST for electronics
        BigDecimal estimatedTax = subtotal.multiply(BigDecimal.valueOf(0.18)).setScale(2, java.math.RoundingMode.HALF_UP);
        dto.setEstimatedTax(estimatedTax);
        // Free shipping for orders above 1000 INR
        BigDecimal estimatedShipping = subtotal.compareTo(BigDecimal.valueOf(1000)) > 0 || subtotal.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO : BigDecimal.valueOf(150);
        dto.setEstimatedShipping(estimatedShipping);
        dto.setTotal(subtotal.add(estimatedTax).add(estimatedShipping));
        dto.setTotalItems(itemDtos.stream().mapToInt(CartItemDto::getQuantity).sum());

        return dto;
    }

    public OrderItemDto toOrderItemDto(OrderItem item) {
        if (item == null) return null;
        OrderItemDto dto = new OrderItemDto();
        dto.setId(item.getId());
        if (item.getProduct() != null) {
            dto.setProductId(item.getProduct().getId());
        }
        dto.setProductName(item.getProductName());
        dto.setProductImage(item.getProductImage());
        dto.setSku(item.getSku());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQuantity());
        dto.setTotalPrice(item.getTotalPrice());
        return dto;
    }

    public OrderDto toOrderDto(Order order) {
        if (order == null) return null;
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserName(order.getUser().getName());
            dto.setUserEmail(order.getUser().getEmail());
        }
        if (order.getAddress() != null) {
            dto.setAddress(toAddressDto(order.getAddress()));
        }
        dto.setShippingFullName(order.getShippingFullName());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setShippingAddressLine(order.getShippingAddressLine());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingState(order.getShippingState());
        dto.setShippingPincode(order.getShippingPincode());
        dto.setSubtotal(order.getSubtotal());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setCouponCode(order.getCouponCode());
        dto.setTrackingNumber(order.getTrackingNumber());
        dto.setCarrierName(order.getCarrierName());
        dto.setEstimatedDelivery(order.getEstimatedDelivery());
        dto.setNotes(order.getNotes());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(this::toOrderItemDto).collect(Collectors.toList()));
        }
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }

    public PaymentDto toPaymentDto(Payment payment) {
        if (payment == null) return null;
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        if (payment.getOrder() != null) {
            dto.setOrderId(payment.getOrder().getId());
            dto.setOrderNumber(payment.getOrder().getOrderNumber());
        }
        dto.setAmount(payment.getAmount());
        dto.setProvider(payment.getProvider());
        dto.setTransactionId(payment.getTransactionId());
        dto.setStatus(payment.getStatus());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }

    public ReviewDto toReviewDto(Review review) {
        if (review == null) return null;
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        if (review.getProduct() != null) {
            dto.setProductId(review.getProduct().getId());
            dto.setProductName(review.getProduct().getName());
        }
        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getId());
            dto.setUserName(review.getUser().getName());
            dto.setUserAvatar(review.getUser().getAvatarUrl());
        }
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setIsVerifiedPurchase(review.getIsVerifiedPurchase());
        dto.setStatus(review.getStatus());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    public CouponDto toCouponDto(Coupon coupon) {
        if (coupon == null) return null;
        CouponDto dto = new CouponDto();
        dto.setId(coupon.getId());
        dto.setCode(coupon.getCode());
        dto.setDiscountType(coupon.getDiscountType());
        dto.setDiscountValue(coupon.getDiscountValue());
        dto.setMinimumOrder(coupon.getMinimumOrder());
        dto.setMaximumDiscount(coupon.getMaximumDiscount());
        dto.setStartDate(coupon.getStartDate());
        dto.setExpiryDate(coupon.getExpiryDate());
        dto.setUsageLimit(coupon.getUsageLimit());
        dto.setPerUserLimit(coupon.getPerUserLimit());
        dto.setTimesUsed(coupon.getTimesUsed());
        dto.setActive(coupon.getActive());
        return dto;
    }

    public ContactMessageDto toContactMessageDto(ContactMessage msg) {
        if (msg == null) return null;
        ContactMessageDto dto = new ContactMessageDto();
        dto.setId(msg.getId());
        dto.setName(msg.getName());
        dto.setEmail(msg.getEmail());
        dto.setSubject(msg.getSubject());
        dto.setMessage(msg.getMessage());
        dto.setStatus(msg.getStatus());
        dto.setAdminNotes(msg.getAdminNotes());
        dto.setCreatedAt(msg.getCreatedAt());
        return dto;
    }

    public NotificationDto toNotificationDto(Notification notif) {
        if (notif == null) return null;
        NotificationDto dto = new NotificationDto();
        dto.setId(notif.getId());
        dto.setTitle(notif.getTitle());
        dto.setMessage(notif.getMessage());
        dto.setType(notif.getType());
        dto.setIsRead(notif.getIsRead());
        dto.setLink(notif.getLink());
        dto.setCreatedAt(notif.getCreatedAt());
        return dto;
    }
}
