package com.techvault.dto;

public class CompatibilityIssue {

    private String severity; // ERROR, WARNING, INFO
    private String component; // CPU, Motherboard, RAM, GPU, PSU, Cooler, Case
    private String message;

    public CompatibilityIssue() {}

    public CompatibilityIssue(String severity, String component, String message) {
        this.severity = severity;
        this.component = component;
        this.message = message;
    }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getComponent() { return component; }
    public void setComponent(String component) { this.component = component; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
