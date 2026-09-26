package com.techvault.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {

    private boolean success = false;
    private String message;
    private String errorCode;
    private LocalDateTime timestamp = LocalDateTime.now();
    private String path;
    private Map<String, String> errors;

    public ErrorResponse() {}

    public ErrorResponse(String message, String errorCode, String path) {
        this.success = false;
        this.message = message;
        this.errorCode = errorCode;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String message, String errorCode, String path, Map<String, String> errors) {
        this.success = false;
        this.message = message;
        this.errorCode = errorCode;
        this.path = path;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public Map<String, String> getErrors() { return errors; }
    public void setErrors(Map<String, String> errors) { this.errors = errors; }
}
