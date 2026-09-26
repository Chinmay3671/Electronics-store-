package com.techvault.service;

import com.techvault.dto.BrandDto;
import com.techvault.dto.BrandRequest;

import java.util.List;

public interface BrandService {
    List<BrandDto> getAllBrands();
    BrandDto getBrandById(Long id);
    BrandDto getBrandBySlug(String slug);
    BrandDto createBrand(BrandRequest request);
    BrandDto updateBrand(Long id, BrandRequest request);
    void deleteBrand(Long id);
}
