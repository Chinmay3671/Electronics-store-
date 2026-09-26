package com.techvault.service;

import com.techvault.dto.ContactMessageDto;
import com.techvault.dto.ContactMessageRequest;
import com.techvault.dto.PagedResponse;
import com.techvault.dto.UpdateMessageStatusRequest;

public interface ContactService {
    ContactMessageDto submitMessage(ContactMessageRequest request);
    PagedResponse<ContactMessageDto> getAllMessages(String status, int page, int size);
    ContactMessageDto updateMessageStatus(Long id, UpdateMessageStatusRequest request);
    void deleteMessage(Long id);
}
