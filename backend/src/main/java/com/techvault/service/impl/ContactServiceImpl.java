package com.techvault.service.impl;

import com.techvault.dto.ContactMessageDto;
import com.techvault.dto.ContactMessageRequest;
import com.techvault.dto.PagedResponse;
import com.techvault.dto.UpdateMessageStatusRequest;
import com.techvault.entity.ContactMessage;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.ContactMessageRepository;
import com.techvault.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private DtoMapper mapper;

    @Override
    @Transactional
    public ContactMessageDto submitMessage(ContactMessageRequest request) {
        ContactMessage msg = new ContactMessage(
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );
        msg.setStatus("NEW");
        ContactMessage saved = contactMessageRepository.save(msg);
        return mapper.toContactMessageDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ContactMessageDto> getAllMessages(String status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ContactMessage> msgPage;
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            msgPage = contactMessageRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase().trim(), pageable);
        } else {
            msgPage = contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        List<ContactMessageDto> dtos = msgPage.getContent().stream().map(mapper::toContactMessageDto).collect(Collectors.toList());
        return new PagedResponse<>(dtos, msgPage.getNumber(), msgPage.getSize(), msgPage.getTotalElements(), msgPage.getTotalPages(), msgPage.isLast());
    }

    @Override
    @Transactional
    public ContactMessageDto updateMessageStatus(Long id, UpdateMessageStatusRequest request) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        msg.setStatus(request.getStatus().toUpperCase().trim());
        if (request.getAdminNotes() != null) msg.setAdminNotes(request.getAdminNotes());
        ContactMessage updated = contactMessageRepository.save(msg);
        return mapper.toContactMessageDto(updated);
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        contactMessageRepository.delete(msg);
    }
}
