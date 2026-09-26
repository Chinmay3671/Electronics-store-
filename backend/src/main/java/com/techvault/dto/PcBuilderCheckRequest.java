package com.techvault.dto;

import java.math.BigDecimal;
import java.util.List;

public class PcBuilderCheckRequest {

    private Long cpuId;
    private Long motherboardId;
    private Long ramId;
    private Long gpuId;
    private Long storageId;
    private Long psuId;
    private Long caseId;
    private Long coolerId;

    public PcBuilderCheckRequest() {}

    public Long getCpuId() { return cpuId; }
    public void setCpuId(Long cpuId) { this.cpuId = cpuId; }

    public Long getMotherboardId() { return motherboardId; }
    public void setMotherboardId(Long motherboardId) { this.motherboardId = motherboardId; }

    public Long getRamId() { return ramId; }
    public void setRamId(Long ramId) { this.ramId = ramId; }

    public Long getGpuId() { return gpuId; }
    public void setGpuId(Long gpuId) { this.gpuId = gpuId; }

    public Long getStorageId() { return storageId; }
    public void setStorageId(Long storageId) { this.storageId = storageId; }

    public Long getPsuId() { return psuId; }
    public void setPsuId(Long psuId) { this.psuId = psuId; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public Long getCoolerId() { return coolerId; }
    public void setCoolerId(Long coolerId) { this.coolerId = coolerId; }
}
