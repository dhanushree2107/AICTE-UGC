package com.aicte.application.controller;

import com.aicte.application.entity.Application;
import com.aicte.application.entity.ApplicationStatus;
import com.aicte.application.repository.ApplicationRepository;
import com.aicte.application.repository.ApplicationStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationStatusRepository applicationStatusRepository;

    // Public API - GET /api/public/application-status/{refNo}
    @GetMapping("/api/public/application-status/{refNo}")
    public ResponseEntity<Map<String, Object>> getPublicStatus(@PathVariable String refNo) {
        Optional<Application> appOpt = applicationRepository.findByRefNo(refNo);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Application app = appOpt.get();
        List<ApplicationStatus> history = applicationStatusRepository.findByApplicationIdOrderByUpdatedAtDesc(app.getId());
        
        Map<String, Object> map = new HashMap<>();
        map.put("application", app);
        map.put("history", history);
        return ResponseEntity.ok(map);
    }

    // Protected APIs
    @GetMapping("/api/applications")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_REGIONAL_OFFICER')")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    @GetMapping("/api/applications/my-applications")
    @PreAuthorize("hasRole('ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<List<Application>> getMyApplications(@RequestParam Long instituteId) {
        return ResponseEntity.ok(applicationRepository.findByInstituteId(instituteId));
    }

    @PostMapping("/api/applications")
    @PreAuthorize("hasRole('ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<Application> createApplication(@RequestBody Application application, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        String refNo = "AICTE-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        application.setRefNo(refNo);
        application.setOverallStatus("SUBMITTED");
        Application savedApp = applicationRepository.save(application);
        
        // Log status
        ApplicationStatus status = new ApplicationStatus();
        status.setApplicationId(savedApp.getId());
        status.setStatus("SUBMITTED");
        status.setRemarks("Application package submitted successfully.");
        status.setUpdatedBy(username);
        applicationStatusRepository.save(status);

        return ResponseEntity.ok(savedApp);
    }

    @PutMapping("/api/applications/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_REGIONAL_OFFICER')")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id, 
            @RequestParam String status, 
            @RequestParam String remarks, 
            @AuthenticationPrincipal Jwt jwt) {
        Optional<Application> appOpt = applicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        String username = jwt.getClaimAsString("preferred_username");
        Application app = appOpt.get();
        app.setOverallStatus(status);
        Application savedApp = applicationRepository.save(app);

        ApplicationStatus appStatus = new ApplicationStatus();
        appStatus.setApplicationId(id);
        appStatus.setStatus(status);
        appStatus.setRemarks(remarks);
        appStatus.setUpdatedBy(username);
        applicationStatusRepository.save(appStatus);

        return ResponseEntity.ok(savedApp);
    }

    // AI Updates Endpoint (Internal or secure)
    @PutMapping("/api/applications/{id}/ai-results")
    public ResponseEntity<Application> updateAIResults(
            @PathVariable Long id,
            @RequestParam Double eligibilityScore,
            @RequestParam Double riskScore,
            @RequestParam String recommendation,
            @RequestParam String reasons) {
        Optional<Application> appOpt = applicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Application app = appOpt.get();
        app.setAiEligibilityScore(eligibilityScore);
        app.setAiRiskScore(riskScore);
        app.setAiRecommendation(recommendation);
        app.setAiReasons(reasons);
        return ResponseEntity.ok(applicationRepository.save(app));
    }
}
