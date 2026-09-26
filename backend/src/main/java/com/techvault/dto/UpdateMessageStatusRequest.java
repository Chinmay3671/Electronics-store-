package com.techvault.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateMessageStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // NEW, IN_PROGRESS, RESOLVED, CLOSED
    private String adminNotes;

    public UpdateMessageStatusRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
