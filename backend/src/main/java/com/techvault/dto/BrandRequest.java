package com.techvault.dto;

import jakarta.validation.constraints.NotBlank;

public class BrandRequest {

    @NotBlank(message = "Brand name is required")
    private String name;
    private String slug;
    private String logoUrl;
    private String description;
    private String website;
    private Boolean active = true;

    public BrandRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
