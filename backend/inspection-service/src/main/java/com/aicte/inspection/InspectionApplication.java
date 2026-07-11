package com.aicte.inspection;

import com.aicte.common.security.CommonSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(CommonSecurityConfig.class)
public class InspectionApplication {
    public static void main(String[] args) {
        SpringApplication.run(InspectionApplication.class, args);
    }
}
