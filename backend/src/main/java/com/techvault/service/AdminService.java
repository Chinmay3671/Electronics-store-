package com.techvault.service;

import com.techvault.dto.AdminDashboardDto;
import com.techvault.dto.PagedResponse;
import com.techvault.dto.UserDto;
import com.techvault.entity.InventoryLog;

public interface AdminService {
    AdminDashboardDto getDashboardStats();
    PagedResponse<UserDto> getAllCustomers(int page, int size);
    PagedResponse<InventoryLog> getInventoryLogs(int page, int size);
}
