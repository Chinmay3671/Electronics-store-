package com.techvault.service.impl;

import com.techvault.dto.CompatibilityIssue;
import com.techvault.dto.PcBuilderCheckRequest;
import com.techvault.dto.PcBuilderCheckResponse;
import com.techvault.entity.Product;
import com.techvault.entity.ProductSpecification;
import com.techvault.repository.ProductRepository;
import com.techvault.service.CompatibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class CompatibilityServiceImpl implements CompatibilityService {

    @Autowired
    private ProductRepository productRepository;

    private Map<String, String> extractSpecs(Product product) {
        Map<String, String> map = new HashMap<>();
        if (product != null && product.getSpecifications() != null) {
            for (ProductSpecification spec : product.getSpecifications()) {
                map.put(spec.getSpecName().toLowerCase().trim(), spec.getSpecValue().trim());
            }
        }
        return map;
    }

    @Override
    @Transactional(readOnly = true)
    public PcBuilderCheckResponse checkCompatibility(PcBuilderCheckRequest request) {
        List<CompatibilityIssue> issues = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        int estimatedWattage = 100; // Base motherboard/fans/drive wattage

        Product cpu = request.getCpuId() != null ? productRepository.findById(request.getCpuId()).orElse(null) : null;
        Product mb = request.getMotherboardId() != null ? productRepository.findById(request.getMotherboardId()).orElse(null) : null;
        Product ram = request.getRamId() != null ? productRepository.findById(request.getRamId()).orElse(null) : null;
        Product gpu = request.getGpuId() != null ? productRepository.findById(request.getGpuId()).orElse(null) : null;
        Product storage = request.getStorageId() != null ? productRepository.findById(request.getStorageId()).orElse(null) : null;
        Product psu = request.getPsuId() != null ? productRepository.findById(request.getPsuId()).orElse(null) : null;
        Product pcCase = request.getCaseId() != null ? productRepository.findById(request.getCaseId()).orElse(null) : null;
        Product cooler = request.getCoolerId() != null ? productRepository.findById(request.getCoolerId()).orElse(null) : null;

        List<Product> selected = Arrays.asList(cpu, mb, ram, gpu, storage, psu, pcCase, cooler);
        for (Product p : selected) {
            if (p != null) {
                totalPrice = totalPrice.add(p.getSalePrice());
            }
        }

        Map<String, String> cpuSpecs = extractSpecs(cpu);
        Map<String, String> mbSpecs = extractSpecs(mb);
        Map<String, String> ramSpecs = extractSpecs(ram);
        Map<String, String> gpuSpecs = extractSpecs(gpu);
        Map<String, String> psuSpecs = extractSpecs(psu);

        // 1. CPU and Motherboard Socket Check
        if (cpu != null && mb != null) {
            String cpuSocket = cpuSpecs.getOrDefault("socket", "").toUpperCase();
            String mbSocket = mbSpecs.getOrDefault("socket", "").toUpperCase();

            // Infer from name if missing from specs
            if (cpuSocket.isEmpty()) {
                if (cpu.getName().contains("AM5") || cpu.getName().contains("7800X3D") || cpu.getName().contains("Ryzen 7")) cpuSocket = "AM5";
                if (cpu.getName().contains("14th") || cpu.getName().contains("13th") || cpu.getName().contains("LGA1700") || cpu.getName().contains("i9")) cpuSocket = "LGA1700";
            }
            if (mbSocket.isEmpty()) {
                if (mb.getName().contains("Z790") || mb.getName().contains("B760") || mb.getName().contains("LGA1700")) mbSocket = "LGA1700";
                if (mb.getName().contains("X670") || mb.getName().contains("B650") || mb.getName().contains("AM5")) mbSocket = "AM5";
            }

            if (!cpuSocket.isEmpty() && !mbSocket.isEmpty() && !cpuSocket.equalsIgnoreCase(mbSocket)) {
                issues.add(new CompatibilityIssue(
                        "ERROR",
                        "CPU & Motherboard",
                        "CPU socket (" + cpuSocket + ") is incompatible with Motherboard socket (" + mbSocket + ")."
                ));
            } else {
                recommendations.add("CPU and Motherboard socket match (" + (cpuSocket.isEmpty() ? "Verified" : cpuSocket) + ").");
            }
        }

        // 2. Motherboard & RAM DDR Type Check
        if (ram != null && mb != null) {
            String ramType = ramSpecs.getOrDefault("memory type", "").toUpperCase();
            if (ramType.isEmpty()) {
                ramType = (ram.getName().contains("DDR5") || ramSpecs.getOrDefault("ram type", "").contains("DDR5")) ? "DDR5" : "DDR4";
            }
            boolean mbSupportsDdr5 = mb.getName().contains("Z790") || mb.getName().contains("X670") || mb.getName().contains("B650") || mb.getDescription().contains("DDR5");
            if ("DDR4".equalsIgnoreCase(ramType) && mbSupportsDdr5 && !mb.getDescription().contains("DDR4")) {
                issues.add(new CompatibilityIssue(
                        "ERROR",
                        "RAM & Motherboard",
                        "Motherboard requires DDR5 memory, but selected RAM is DDR4."
                ));
            } else {
                recommendations.add("RAM type (" + ramType + ") is fully supported by the motherboard.");
            }
        }

        // 3. Power Consumption & PSU Calculation
        int cpuWatts = 120;
        int gpuWatts = 0;
        if (cpu != null) {
            if (cpu.getName().contains("i9") || cpu.getName().contains("14900")) cpuWatts = 250;
            else if (cpu.getName().contains("7800X3D") || cpu.getName().contains("Ryzen 7")) cpuWatts = 120;
            estimatedWattage += cpuWatts;
        }

        if (gpu != null) {
            if (gpu.getName().contains("4090")) gpuWatts = 450;
            else if (gpu.getName().contains("4080")) gpuWatts = 320;
            else if (gpu.getName().contains("4070")) gpuWatts = 220;
            else gpuWatts = 180;
            estimatedWattage += gpuWatts;
        }

        if (psu != null) {
            int psuWatts = 750;
            if (psu.getName().contains("1000W") || psu.getName().contains("RM1000")) psuWatts = 1000;
            else if (psu.getName().contains("850W")) psuWatts = 850;
            else if (psu.getName().contains("650W")) psuWatts = 650;

            if (psuWatts < estimatedWattage + 100) {
                issues.add(new CompatibilityIssue(
                        "WARNING",
                        "Power Supply",
                        "Selected " + psuWatts + "W PSU is close to estimated peak wattage (" + estimatedWattage + "W). Recommended minimum: " + (estimatedWattage + 150) + "W."
                ));
            } else {
                recommendations.add("PSU wattage (" + psuWatts + "W) provides healthy overhead for " + estimatedWattage + "W estimated draw.");
            }
        } else if (estimatedWattage > 300) {
            recommendations.add("Recommended PSU for this build: at least " + (estimatedWattage + 150) + "W 80+ Gold.");
        }

        boolean compatible = issues.stream().noneMatch(i -> "ERROR".equals(i.getSeverity()));

        return new PcBuilderCheckResponse(compatible, estimatedWattage, totalPrice, issues, recommendations);
    }
}
