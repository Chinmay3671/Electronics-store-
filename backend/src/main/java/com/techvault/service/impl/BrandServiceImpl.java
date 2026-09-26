package com.techvault.service.impl;

import com.techvault.dto.BrandDto;
import com.techvault.dto.BrandRequest;
import com.techvault.entity.Brand;
import com.techvault.exception.BadRequestException;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.BrandRepository;
import com.techvault.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private DtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<BrandDto> getAllBrands() {
        return brandRepository.findByActiveTrueOrderByNameAsc()
                .stream().map(mapper::toBrandDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BrandDto getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + id));
        return mapper.toBrandDto(brand);
    }

    @Override
    @Transactional(readOnly = true)
    public BrandDto getBrandBySlug(String slug) {
        Brand brand = brandRepository.findBySlug(slug.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with slug: " + slug));
        return mapper.toBrandDto(brand);
    }

    @Override
    @Transactional
    public BrandDto createBrand(BrandRequest request) {
        String slug = request.getSlug() != null && !request.getSlug().trim().isEmpty()
                ? request.getSlug().toLowerCase().trim().replaceAll("[^a-z0-9-]", "-")
                : request.getName().toLowerCase().trim().replaceAll("[^a-z0-9-]", "-");

        if (brandRepository.existsByName(request.getName())) {
            throw new BadRequestException("Brand with name '" + request.getName() + "' already exists");
        }

        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setSlug(slug);
        brand.setLogoUrl(request.getLogoUrl());
        brand.setDescription(request.getDescription());
        brand.setWebsite(request.getWebsite());
        brand.setActive(request.getActive() != null ? request.getActive() : true);

        Brand saved = brandRepository.save(brand);
        return mapper.toBrandDto(saved);
    }

    @Override
    @Transactional
    public BrandDto updateBrand(Long id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        brand.setName(request.getName());
        if (request.getSlug() != null) brand.setSlug(request.getSlug().toLowerCase().trim());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setDescription(request.getDescription());
        brand.setWebsite(request.getWebsite());
        if (request.getActive() != null) brand.setActive(request.getActive());

        Brand updated = brandRepository.save(brand);
        return mapper.toBrandDto(updated);
    }

    @Override
    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        brandRepository.delete(brand);
    }
}
