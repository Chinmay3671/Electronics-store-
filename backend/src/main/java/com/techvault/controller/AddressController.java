package com.techvault.controller;

import com.techvault.dto.AddressDto;
import com.techvault.dto.AddressRequest;
import com.techvault.dto.ApiResponse;
import com.techvault.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@Tag(name = "Addresses", description = "Customer shipping and billing address management")
@SecurityRequirement(name = "BearerAuth")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping
    @Operation(summary = "Get all saved addresses for current user")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getUserAddresses() {
        List<AddressDto> addresses = addressService.getUserAddresses();
        return ResponseEntity.ok(ApiResponse.ok("Addresses retrieved successfully", addresses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get address by ID")
    public ResponseEntity<ApiResponse<AddressDto>> getAddressById(@PathVariable Long id) {
        AddressDto address = addressService.getAddressById(id);
        return ResponseEntity.ok(ApiResponse.ok("Address retrieved successfully", address));
    }

    @PostMapping
    @Operation(summary = "Create a new delivery address")
    public ResponseEntity<ApiResponse<AddressDto>> createAddress(@Valid @RequestBody AddressRequest request) {
        AddressDto created = addressService.createAddress(request);
        return ResponseEntity.ok(ApiResponse.ok("Address added successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing delivery address")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest request) {
        AddressDto updated = addressService.updateAddress(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Address updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(ApiResponse.ok("Address deleted successfully"));
    }

    @PutMapping("/{id}/default")
    @Operation(summary = "Set address as default")
    public ResponseEntity<ApiResponse<AddressDto>> setDefaultAddress(@PathVariable Long id) {
        AddressDto address = addressService.setDefaultAddress(id);
        return ResponseEntity.ok(ApiResponse.ok("Default address updated successfully", address));
    }
}
