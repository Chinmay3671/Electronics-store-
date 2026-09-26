package com.techvault.service;

import com.techvault.dto.AddressDto;
import com.techvault.dto.AddressRequest;

import java.util.List;

public interface AddressService {
    List<AddressDto> getUserAddresses();
    AddressDto getAddressById(Long id);
    AddressDto createAddress(AddressRequest request);
    AddressDto updateAddress(Long id, AddressRequest request);
    void deleteAddress(Long id);
    AddressDto setDefaultAddress(Long id);
}
