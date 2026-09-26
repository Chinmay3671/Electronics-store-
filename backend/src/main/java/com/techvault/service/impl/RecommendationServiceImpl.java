package com.techvault.service.impl;

import com.techvault.dto.RecommendationItemDto;
import com.techvault.dto.RecommendationRequest;
import com.techvault.dto.RecommendationResponse;
import com.techvault.entity.Product;
import com.techvault.entity.ProductSpecification;
import com.techvault.repository.ProductRepository;
import com.techvault.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public RecommendationResponse getRecommendations(RecommendationRequest request) {
        List<Product> allProducts = productRepository.findAll();
        List<RecommendationItemDto> scoredItems = new ArrayList<>();

        String targetCategory = request.getCategory() != null ? request.getCategory().toLowerCase().trim() : "";
        BigDecimal budget = request.getBudget();
        List<String> usages = request.getUsage() != null ? request.getUsage() : Collections.emptyList();
        String brandPref = request.getBrandPreference() != null ? request.getBrandPreference().toLowerCase().trim() : "";
        Integer reqRam = request.getRam();
        Integer reqStorage = request.getStorage();

        for (Product product : allProducts) {
            // Category filter if specified
            if (!targetCategory.isEmpty() && !"all".equalsIgnoreCase(targetCategory)) {
                String pCat = product.getCategory().getSlug().toLowerCase();
                if (!pCat.contains(targetCategory) && !targetCategory.contains(pCat)) {
                    continue;
                }
            }

            int score = 50; // Baseline score
            List<String> matchReasons = new ArrayList<>();
            Map<String, String> specMap = new HashMap<>();

            for (ProductSpecification spec : product.getSpecifications()) {
                specMap.put(spec.getSpecName().toLowerCase(), spec.getSpecValue());
            }

            // 1. Budget Evaluation
            if (budget != null && budget.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal price = product.getSalePrice();
                if (price.compareTo(budget) <= 0) {
                    score += 25;
                    matchReasons.add("Priced at ₹" + price + ", well within your ₹" + budget + " budget");
                } else if (price.compareTo(budget.multiply(BigDecimal.valueOf(1.15))) <= 0) {
                    score += 15;
                    matchReasons.add("Slightly above budget but delivers high tier performance value");
                } else {
                    score -= 20;
                }
            }

            // 2. Brand Preference
            if (!brandPref.isEmpty() && !"any".equalsIgnoreCase(brandPref)) {
                if (product.getBrand().getName().toLowerCase().contains(brandPref) ||
                    product.getBrand().getSlug().toLowerCase().contains(brandPref)) {
                    score += 20;
                    matchReasons.add("Matches your preferred brand choice: " + product.getBrand().getName());
                }
            }

            // 3. RAM Specification
            if (reqRam != null && reqRam > 0) {
                String ramSpec = specMap.getOrDefault("ram", "").toLowerCase();
                if (ramSpec.contains(reqRam + "gb") || ramSpec.contains(reqRam + " gb")) {
                    score += 20;
                    matchReasons.add("Includes your target " + reqRam + "GB RAM configuration");
                } else if (ramSpec.contains("16gb") || ramSpec.contains("32gb")) {
                    score += 10;
                    matchReasons.add("High memory capacity suitable for intensive workloads (" + ramSpec + ")");
                }
            }

            // 4. Usage Analysis
            for (String usage : usages) {
                String u = usage.toLowerCase();
                if ("gaming".equals(u)) {
                    if (product.getName().toLowerCase().contains("gaming") ||
                        product.getName().toLowerCase().contains("rtx") ||
                        product.getDescription().toLowerCase().contains("gaming") ||
                        product.getCategory().getSlug().contains("gaming")) {
                        score += 20;
                        matchReasons.add("Optimized for high-FPS gaming & ray-traced visuals");
                    }
                }
                if ("college".equals(u) || "office".equals(u)) {
                    if (product.getDescription().toLowerCase().contains("battery") ||
                        product.getDescription().toLowerCase().contains("portable") ||
                        product.getSalePrice().compareTo(BigDecimal.valueOf(150000)) <= 0) {
                        score += 15;
                        matchReasons.add("Great battery life and lightweight portability for campus/office");
                    }
                }
                if ("video-editing".equals(u) || "coding".equals(u)) {
                    if (product.getDescription().toLowerCase().contains("creator") ||
                        product.getDescription().toLowerCase().contains("pro") ||
                        product.getDescription().toLowerCase().contains("ultra")) {
                        score += 15;
                        matchReasons.add("Fast multi-core processing speeds for compiling and media rendering");
                    }
                }
            }

            // 5. Ratings & Highlights
            if (product.getRating() != null && product.getRating().compareTo(BigDecimal.valueOf(4.5)) >= 0) {
                score += 10;
                matchReasons.add("Highly rated by verified buyers (" + product.getRating() + " ★)");
            }

            // Bound score between 65% and 99%
            int finalScore = Math.min(99, Math.max(65, score));

            if (matchReasons.isEmpty()) {
                matchReasons.add("Matches category requirements and available stock");
                matchReasons.add("Includes manufacturer warranty and official accessories");
            }

            RecommendationItemDto item = new RecommendationItemDto();
            item.setId(product.getId());
            item.setName(product.getName());
            item.setSlug(product.getSlug());
            item.setMainImage(product.getMainImage());
            item.setPrice(product.getSalePrice());
            item.setOriginalPrice(product.getOriginalPrice());
            item.setDiscountPercent(product.getDiscountPercent());
            item.setRating(product.getRating());
            item.setReviewCount(product.getReviewCount());
            item.setMatchScore(finalScore);
            item.setMatchReasons(matchReasons);
            item.setKeySpecs(specMap);

            scoredItems.add(item);
        }

        // Sort descending by match score
        scoredItems.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        List<RecommendationItemDto> topRecommendations = scoredItems.stream().limit(6).collect(Collectors.toList());

        String summary = "Found " + topRecommendations.size() + " top recommendations based on your preferences";
        return new RecommendationResponse(summary, topRecommendations, scoredItems.size());
    }
}
