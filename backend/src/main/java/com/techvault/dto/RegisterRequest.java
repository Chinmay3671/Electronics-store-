package com.techvault.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    private String name;
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    private String confirmPassword;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;

    public RegisterRequest() {}

    // Getters and Setters
    public String getName() {
        if (name != null && !name.trim().isEmpty()) return name;
        if (fullName != null && !fullName.trim().isEmpty()) return fullName;
        return "Customer";
    }

    public void setName(String name) {
        this.name = name;
        if (this.fullName == null) this.fullName = name;
    }

    public String getFullName() {
        return getName();
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
        if (this.name == null) this.name = fullName;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}
