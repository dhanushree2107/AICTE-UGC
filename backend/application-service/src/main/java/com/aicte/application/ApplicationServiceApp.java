package com.aicte.application;

import com.aicte.common.security.CommonSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(CommonSecurityConfig.class)
@EnableCaching
public class ApplicationServiceApp {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationServiceApp.class, args);
    }
}
