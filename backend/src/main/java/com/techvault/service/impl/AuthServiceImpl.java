package com.techvault.service.impl;

import com.techvault.dto.*;
import com.techvault.entity.Address;
import com.techvault.entity.PasswordResetToken;
import com.techvault.entity.User;
import com.techvault.exception.BadRequestException;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.repository.AddressRepository;
import com.techvault.repository.PasswordResetTokenRepository;
import com.techvault.repository.UserRepository;
import com.techvault.security.JwtUtils;
import com.techvault.service.AuthService;
import com.techvault.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account already exists with email: " + request.getEmail());
        }

        User user = new User(
                request.getName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                "ROLE_USER"
        );
        user.setStatus("ACTIVE");
        user.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        User savedUser = userRepository.save(user);

        // If initial address provided
        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
            Address addr = new Address();
            addr.setUser(savedUser);
            addr.setFullName(request.getName());
            addr.setPhone(request.getPhone() != null ? request.getPhone() : "");
            addr.setAddressLine(request.getAddress());
            addr.setCity(request.getCity() != null ? request.getCity() : "");
            addr.setState(request.getState() != null ? request.getState() : "");
            addr.setPincode(request.getPincode() != null ? request.getPincode() : "");
            addr.setAddressType("HOME");
            addr.setIsDefault(true);
            addressRepository.save(addr);
        }

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName());

        String jwt = jwtUtils.generateTokenFromUsername(savedUser.getEmail());

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getPhone(),
                savedUser.getAvatarUrl()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAvatarUrl()
        );
    }

    @Override
    @Transactional
    public void forgotPassword(PasswordResetRequest request) {
        userRepository.findByEmail(request.getEmail().toLowerCase().trim()).ifPresent(user -> {
            passwordResetTokenRepository.deleteByEmail(user.getEmail());
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(
                    user.getEmail(),
                    token,
                    LocalDateTime.now().plusHours(24)
            );
            passwordResetTokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), token);
        });
        // Always succeed to prevent email enumeration
    }

    @Override
    @Transactional
    public void resetPassword(NewPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndIsUsedFalse(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        if (resetToken.isExpired()) {
            throw new BadRequestException("Password reset token has expired");
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setIsUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
