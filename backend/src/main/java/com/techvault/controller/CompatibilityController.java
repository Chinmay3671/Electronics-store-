package com.techvault.controller;

import com.techvault.dto.PcBuilderCheckRequest;
import com.techvault.dto.PcBuilderCheckResponse;
import com.techvault.service.CompatibilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compatibility")
@Tag(name = "PC Builder", description = "PC components compatibility & power consumption checker")
public class CompatibilityController {

    @Autowired
    private CompatibilityService compatibilityService;

    @PostMapping("/check")
    @Operation(summary = "Validate hardware compatibility for custom PC builds")
    public ResponseEntity<PcBuilderCheckResponse> checkCompatibility(@RequestBody PcBuilderCheckRequest request) {
        PcBuilderCheckResponse response = compatibilityService.checkCompatibility(request);
        return ResponseEntity.ok(response);
    }
}
