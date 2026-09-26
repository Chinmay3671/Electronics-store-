package com.techvault.service.impl;

import com.techvault.dto.*;
import com.techvault.entity.*;
import com.techvault.exception.BadRequestException;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.*;
import com.techvault.service.EmailService;
import com.techvault.service.ProductService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductSpecificationRepository specRepository;

    @Autowired
    private ProductImageRepository imageRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private DtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProductSummaryDto> getProducts(
            String search,
            String categorySlug,
            String brandSlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            String status,
            Boolean isFeatured,
            Boolean isTrending,
            Boolean isFlashDeal,
            Boolean isNewArrival,
            String sortBy,
            int page,
            int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "salePrice");
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "salePrice");
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else if ("popularity".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "reviewCount");
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), term);
                Predicate skuMatch = cb.like(cb.lower(root.get("sku")), term);
                Predicate descMatch = cb.like(cb.lower(root.get("shortDescription")), term);
                Predicate brandMatch = cb.like(cb.lower(root.get("brand").get("name")), term);
                Predicate catMatch = cb.like(cb.lower(root.get("category").get("name")), term);
                predicates.add(cb.or(nameMatch, skuMatch, descMatch, brandMatch, catMatch));
            }

            if (categorySlug != null && !categorySlug.trim().isEmpty() && !"all".equalsIgnoreCase(categorySlug)) {
                predicates.add(cb.equal(cb.lower(root.get("category").get("slug")), categorySlug.trim().toLowerCase()));
            }

            if (brandSlug != null && !brandSlug.trim().isEmpty() && !"all".equalsIgnoreCase(brandSlug)) {
                predicates.add(cb.equal(cb.lower(root.get("brand").get("slug")), brandSlug.trim().toLowerCase()));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salePrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salePrice"), maxPrice));
            }

            if (minRating != null && minRating > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), BigDecimal.valueOf(minRating)));
            }

            if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(root.get("status"), status.trim().toUpperCase()));
            }

            if (Boolean.TRUE.equals(isFeatured)) {
                predicates.add(cb.isTrue(root.get("isFeatured")));
            }
            if (Boolean.TRUE.equals(isTrending)) {
                predicates.add(cb.isTrue(root.get("isTrending")));
            }
            if (Boolean.TRUE.equals(isFlashDeal)) {
                predicates.add(cb.isTrue(root.get("isFlashDeal")));
            }
            if (Boolean.TRUE.equals(isNewArrival)) {
                predicates.add(cb.isTrue(root.get("isNewArrival")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        List<ProductSummaryDto> dtos = productPage.getContent().stream()
                .map(mapper::toProductSummaryDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return mapper.toProductDto(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapper.toProductDto(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue().stream()
                .map(mapper::toProductSummaryDto).limit(10).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getTrendingProducts() {
        return productRepository.findByIsTrendingTrue().stream()
                .map(mapper::toProductSummaryDto).limit(10).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getFlashDeals() {
        return productRepository.findByIsFlashDealTrue().stream()
                .map(mapper::toProductSummaryDto).limit(10).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrue().stream()
                .map(mapper::toProductSummaryDto).limit(10).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getSearchSuggestions(String query) {
        if (query == null || query.trim().length() < 2) return Collections.emptyList();
        Pageable limit = PageRequest.of(0, 8);
        return productRepository.searchSuggestions(query.trim(), limit).stream()
                .map(mapper::toProductSummaryDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getCompareProducts(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) return Collections.emptyList();
        List<Long> limitedIds = productIds.stream().limit(4).collect(Collectors.toList());
        return productRepository.findByIdsIn(limitedIds).stream()
                .map(mapper::toProductDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductDto createProduct(ProductCreateRequest request) {
        String slug = request.getSlug() != null && !request.getSlug().trim().isEmpty()
                ? request.getSlug().toLowerCase().trim().replaceAll("[^a-z0-9-]", "-")
                : request.getName().toLowerCase().trim().replaceAll("[^a-z0-9-]", "-");

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(slug);
        product.setSku(request.getSku().toUpperCase().trim());
        product.setShortDescription(request.getShortDescription());
        product.setDescription(request.getDescription());
        product.setBrand(brand);
        product.setCategory(category);
        product.setOriginalPrice(request.getOriginalPrice());
        product.setSalePrice(request.getSalePrice());
        product.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : 0);
        product.setStock(request.getStock());
        product.setLowStockThreshold(request.getLowStockThreshold() != null ? request.getLowStockThreshold() : 5);
        product.setWarranty(request.getWarranty());
        product.setWhatsInBox(request.getWhatsInBox());
        product.setMainImage(request.getMainImage());
        product.setIsFeatured(Boolean.TRUE.equals(request.getIsFeatured()));
        product.setIsTrending(Boolean.TRUE.equals(request.getIsTrending()));
        product.setIsFlashDeal(Boolean.TRUE.equals(request.getIsFlashDeal()));
        product.setIsNewArrival(Boolean.TRUE.equals(request.getIsNewArrival()));
        product.calculateStockStatus();

        Product savedProduct = productRepository.save(product);

        if (request.getSpecifications() != null) {
            for (ProductSpecificationDto sDto : request.getSpecifications()) {
                ProductSpecification spec = new ProductSpecification(
                        savedProduct,
                        sDto.getSpecGroup() != null ? sDto.getSpecGroup() : "General",
                        sDto.getSpecName(),
                        sDto.getSpecValue(),
                        Boolean.TRUE.equals(sDto.getIsHighlighted()),
                        sDto.getDisplayOrder() != null ? sDto.getDisplayOrder() : 0
                );
                savedProduct.addSpecification(spec);
            }
        }

        if (request.getImages() != null) {
            for (ProductImageDto iDto : request.getImages()) {
                ProductImage img = new ProductImage(
                        savedProduct,
                        iDto.getImageUrl(),
                        iDto.getAltText(),
                        iDto.getDisplayOrder() != null ? iDto.getDisplayOrder() : 0,
                        Boolean.TRUE.equals(iDto.getIsPrimary())
                );
                savedProduct.addImage(img);
            }
        }

        Product result = productRepository.save(savedProduct);

        // Record initial stock creation in inventory logs
        InventoryLog log = new InventoryLog(
                result,
                "RESTOCK",
                result.getStock(),
                0,
                result.getStock(),
                "INIT-" + result.getSku(),
                "Initial product creation stock"
        );
        inventoryLogRepository.save(log);

        return mapper.toProductDto(result);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, ProductCreateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setName(request.getName());
        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            product.setSlug(request.getSlug().toLowerCase().trim().replaceAll("[^a-z0-9-]", "-"));
        }
        product.setSku(request.getSku().toUpperCase().trim());
        product.setShortDescription(request.getShortDescription());
        product.setDescription(request.getDescription());
        product.setBrand(brand);
        product.setCategory(category);
        product.setOriginalPrice(request.getOriginalPrice());
        product.setSalePrice(request.getSalePrice());
        product.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : 0);
        
        int prevStock = product.getStock();
        product.setStock(request.getStock());
        product.setLowStockThreshold(request.getLowStockThreshold() != null ? request.getLowStockThreshold() : 5);
        product.setWarranty(request.getWarranty());
        product.setWhatsInBox(request.getWhatsInBox());
        if (request.getMainImage() != null) product.setMainImage(request.getMainImage());
        if (request.getIsFeatured() != null) product.setIsFeatured(request.getIsFeatured());
        if (request.getIsTrending() != null) product.setIsTrending(request.getIsTrending());
        if (request.getIsFlashDeal() != null) product.setIsFlashDeal(request.getIsFlashDeal());
        if (request.getIsNewArrival() != null) product.setIsNewArrival(request.getIsNewArrival());
        product.calculateStockStatus();

        // Update specifications
        if (request.getSpecifications() != null) {
            product.getSpecifications().clear();
            for (ProductSpecificationDto sDto : request.getSpecifications()) {
                ProductSpecification spec = new ProductSpecification(
                        product,
                        sDto.getSpecGroup() != null ? sDto.getSpecGroup() : "General",
                        sDto.getSpecName(),
                        sDto.getSpecValue(),
                        Boolean.TRUE.equals(sDto.getIsHighlighted()),
                        sDto.getDisplayOrder() != null ? sDto.getDisplayOrder() : 0
                );
                product.addSpecification(spec);
            }
        }

        // Update images
        if (request.getImages() != null) {
            product.getImages().clear();
            for (ProductImageDto iDto : request.getImages()) {
                ProductImage img = new ProductImage(
                        product,
                        iDto.getImageUrl(),
                        iDto.getAltText(),
                        iDto.getDisplayOrder() != null ? iDto.getDisplayOrder() : 0,
                        Boolean.TRUE.equals(iDto.getIsPrimary())
                );
                product.addImage(img);
            }
        }

        Product updated = productRepository.save(product);

        if (prevStock != updated.getStock()) {
            InventoryLog log = new InventoryLog(
                    updated,
                    "ADJUSTMENT",
                    updated.getStock() - prevStock,
                    prevStock,
                    updated.getStock(),
                    "MANUAL-UPDATE",
                    "Admin manual stock edit"
            );
            inventoryLogRepository.save(log);
        }

        return mapper.toProductDto(updated);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
    }

    @Override
    @Transactional
    public ProductDto updateStock(Long id, int quantity, String changeType, String reason) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        int prevStock = product.getStock();
        int newStock = prevStock + quantity;
        if (newStock < 0) {
            throw new BadRequestException("Stock cannot be negative");
        }

        product.setStock(newStock);
        product.calculateStockStatus();
        Product saved = productRepository.save(product);

        InventoryLog log = new InventoryLog(
                saved,
                changeType != null ? changeType : "ADJUSTMENT",
                quantity,
                prevStock,
                newStock,
                "ADMIN-STOCK-ADJ",
                reason != null ? reason : "Direct stock modification"
        );
        inventoryLogRepository.save(log);

        if (newStock <= saved.getLowStockThreshold()) {
            emailService.sendLowStockAlertToAdmin(saved.getName(), newStock, saved.getLowStockThreshold());
        }

        return mapper.toProductDto(saved);
    }
}
