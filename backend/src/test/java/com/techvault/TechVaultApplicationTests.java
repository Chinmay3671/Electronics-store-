package com.techvault;

import com.techvault.dto.LoginRequest;
import com.techvault.dto.RegisterRequest;
import com.techvault.service.AuthService;
import com.techvault.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class TechVaultApplicationTests {

    @Autowired
    private ProductService productService;

    @Autowired
    private AuthService authService;

    @Test
    void contextLoads() {
        assertNotNull(productService, "ProductService should be loaded");
        assertNotNull(authService, "AuthService should be loaded");
    }

    @Test
    void testProductsLoaded() {
        var featured = productService.getFeaturedProducts();
        assertNotNull(featured);
        assertFalse(featured.isEmpty(), "Featured products should not be empty after data seeding");
    }

    @Test
    void testAdminLogin() {
        var response = authService.login(new LoginRequest("admin@techvault.com", "Password123!"));
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("ROLE_ADMIN", response.getRole());
    }

    @Test
    void testUserLogin() {
        var response = authService.login(new LoginRequest("user@techvault.com", "Password123!"));
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("ROLE_USER", response.getRole());
    }
}
