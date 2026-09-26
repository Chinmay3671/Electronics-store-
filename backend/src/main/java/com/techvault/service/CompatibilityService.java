package com.techvault.service;

import com.techvault.dto.PcBuilderCheckRequest;
import com.techvault.dto.PcBuilderCheckResponse;

public interface CompatibilityService {
    PcBuilderCheckResponse checkCompatibility(PcBuilderCheckRequest request);
}
