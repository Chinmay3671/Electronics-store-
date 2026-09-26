package com.techvault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TechVaultApplication {

    public static void main(String[] args) {
        SpringApplication.run(TechVaultApplication.class, args);
    }
}
