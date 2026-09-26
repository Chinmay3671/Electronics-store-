package com.techvault.dto;

import java.math.BigDecimal;
import java.util.List;

public class RecommendationRequest {

    private String category; // laptop, smartphone, pc-components, etc.
    private BigDecimal budget;
    private List<String> usage; // gaming, coding, college, video-editing, office, casual
    private String brandPreference;
    private Integer ram; // in GB
    private Integer storage; // in GB
    private String gpuRequirement;
    private String priority; // performance, battery, portability, value

    public RecommendationRequest() {}

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public List<String> getUsage() { return usage; }
    public void setUsage(List<String> usage) { this.usage = usage; }

    public String getBrandPreference() { return brandPreference; }
    public void setBrandPreference(String brandPreference) { this.brandPreference = brandPreference; }

    public Integer getRam() { return ram; }
    public void setRam(Integer ram) { this.ram = ram; }

    public Integer getStorage() { return storage; }
    public void setStorage(Integer storage) { this.storage = storage; }

    public String getGpuRequirement() { return gpuRequirement; }
    public void setGpuRequirement(String gpuRequirement) { this.gpuRequirement = gpuRequirement; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
