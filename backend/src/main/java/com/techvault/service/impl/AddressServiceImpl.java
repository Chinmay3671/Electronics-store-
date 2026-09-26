package com.techvault.service.impl;

import com.techvault.dto.AddressDto;
import com.techvault.dto.AddressRequest;
import com.techvault.entity.Address;
import com.techvault.entity.User;
import com.techvault.exception.ResourceNotFoundException;
import com.techvault.mapper.DtoMapper;
import com.techvault.repository.AddressRepository;
import com.techvault.repository.UserRepository;
import com.techvault.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DtoMapper mapper;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses() {
        User user = getAuthenticatedUser();
        return addressRepository.findByUserId(user.getId())
                .stream().map(mapper::toAddressDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AddressDto getAddressById(Long id) {
        User user = getAuthenticatedUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        return mapper.toAddressDto(address);
    }

    @Override
    @Transactional
    public AddressDto createAddress(AddressRequest request) {
        User user = getAuthenticatedUser();

        List<Address> existing = addressRepository.findByUserId(user.getId());
        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault()) || existing.isEmpty();

        if (shouldBeDefault) {
            existing.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(existing);
        }

        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setLandmark(request.getLandmark());
        address.setAddressType(request.getAddressType() != null ? request.getAddressType() : "HOME");
        address.setIsDefault(shouldBeDefault);

        Address saved = addressRepository.save(address);
        return mapper.toAddressDto(saved);
    }

    @Override
    @Transactional
    public AddressDto updateAddress(Long id, AddressRequest request) {
        User user = getAuthenticatedUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<Address> others = addressRepository.findByUserId(user.getId());
            others.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(others);
            address.setIsDefault(true);
        }

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setLandmark(request.getLandmark());
        if (request.getAddressType() != null) address.setAddressType(request.getAddressType());

        Address updated = addressRepository.save(address);
        return mapper.toAddressDto(updated);
    }

    @Override
    @Transactional
    public void deleteAddress(Long id) {
        User user = getAuthenticatedUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        addressRepository.delete(address);
    }

    @Override
    @Transactional
    public AddressDto setDefaultAddress(Long id) {
        User user = getAuthenticatedUser();
        List<Address> addresses = addressRepository.findByUserId(user.getId());
        Address target = null;
        for (Address a : addresses) {
            if (a.getId().equals(id)) {
                a.setIsDefault(true);
                target = a;
            } else {
                a.setIsDefault(false);
            }
        }
        if (target == null) {
            throw new ResourceNotFoundException("Address not found");
        }
        addressRepository.saveAll(addresses);
        return mapper.toAddressDto(target);
    }
}
