package com.aicte.institute;

import com.aicte.common.security.CommonSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(CommonSecurityConfig.class)
public class InstituteApplication {
    public static void main(String[] args) {
        SpringApplication.run(InstituteApplication.class, args);
    }
}
