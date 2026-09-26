package com.techvault.service;

import com.techvault.dto.PasswordChangeRequest;
import com.techvault.dto.UserDto;
import com.techvault.dto.UserUpdateRequest;

public interface UserService {
    UserDto getCurrentUser();
    UserDto updateCurrentUser(UserUpdateRequest request);
    void changePassword(PasswordChangeRequest request);
}
