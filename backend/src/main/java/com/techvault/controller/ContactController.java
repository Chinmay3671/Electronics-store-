package com.techvault.controller;

import com.techvault.dto.ApiResponse;
import com.techvault.dto.ContactMessageDto;
import com.techvault.dto.ContactMessageRequest;
import com.techvault.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@Tag(name = "Contact", description = "Customer inquiries and feedback submission")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    @Operation(summary = "Submit a customer support or inquiry message")
    public ResponseEntity<ApiResponse<ContactMessageDto>> submitContactMessage(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessageDto message = contactService.submitMessage(request);
        return ResponseEntity.ok(ApiResponse.ok("Thank you for reaching out! Our team will respond shortly.", message));
    }
}
