package com.techvault.service;

import com.techvault.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void forgotPassword(PasswordResetRequest request);
    void resetPassword(NewPasswordRequest request);
}
