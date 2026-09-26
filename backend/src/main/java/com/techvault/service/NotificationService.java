package com.techvault.service;

import com.techvault.dto.NotificationDto;
import com.techvault.dto.PagedResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationDto> getUserNotifications();
    PagedResponse<NotificationDto> getUserNotificationsPaged(int page, int size);
    long getUnreadCount();
    void markAsRead(Long id);
    void markAllAsRead();
}
