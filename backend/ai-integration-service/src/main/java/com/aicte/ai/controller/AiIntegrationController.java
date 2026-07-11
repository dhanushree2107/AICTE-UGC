package com.aicte.ai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiIntegrationController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    // A. Document Verification Agent Proxy (with Redis cache support)
    @PostMapping("/verify-document")
    @Cacheable(value = "ai_documents", key = "#documentId")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<Map> verifyDocument(
            @RequestParam Long documentId,
            @RequestParam String filePath,
            @RequestParam String documentType) {
        
        String url = aiServiceUrl + "/api/ai/verify-document";
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("documentId", documentId);
        requestBody.put("filePath", filePath);
        requestBody.put("documentType", documentType);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            Map<String, String> errMap = new HashMap<>();
            errMap.put("error", "AI service unreachable");
            errMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errMap);
        }
    }

    // B-E. Complete Application Analysis Pipeline (Eligibility, Compliance, Risk, Recommendation)
    @PostMapping("/analyze-application")
    @Cacheable(value = "ai_applications", key = "#applicationId")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER')")
    public ResponseEntity<Map> analyzeApplication(@RequestParam Long applicationId) {
        Map<String, Object> analysisResult = new HashMap<>();
        
        // 1. Call FastAPI Eligibility validation
        String eligibilityUrl = aiServiceUrl + "/api/ai/validate-eligibility?applicationId=" + applicationId;
        try {
            Map eligibility = restTemplate.postForObject(eligibilityUrl, null, Map.class);
            analysisResult.put("eligibility", eligibility);
        } catch (Exception e) {
            analysisResult.put("eligibility_error", e.getMessage());
        }

        // 2. Call FastAPI Compliance check
        String complianceUrl = aiServiceUrl + "/api/ai/check-compliance?applicationId=" + applicationId;
        try {
            Map compliance = restTemplate.postForObject(complianceUrl, null, Map.class);
            analysisResult.put("compliance", compliance);
        } catch (Exception e) {
            analysisResult.put("compliance_error", e.getMessage());
        }

        // 3. Call FastAPI Risk Assessment
        String riskUrl = aiServiceUrl + "/api/ai/assess-risk?applicationId=" + applicationId;
        try {
            Map risk = restTemplate.postForObject(riskUrl, null, Map.class);
            analysisResult.put("risk", risk);
        } catch (Exception e) {
            analysisResult.put("risk_error", e.getMessage());
        }

        // 4. Call FastAPI Approval Recommendation
        String recommendUrl = aiServiceUrl + "/api/ai/approval-recommendation?applicationId=" + applicationId;
        try {
            Map recommendation = restTemplate.postForObject(recommendUrl, null, Map.class);
            analysisResult.put("recommendation", recommendation);
        } catch (Exception e) {
            analysisResult.put("recommendation_error", e.getMessage());
        }

        return ResponseEntity.ok(analysisResult);
    }

    // F. AI Help Desk chat route proxy
    @PostMapping("/helpdesk/chat")
    public ResponseEntity<Map> chatHelpDesk(@RequestBody Map<String, String> payload) {
        String url = aiServiceUrl + "/api/ai/helpdesk/chat";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            Map<String, String> errMap = new HashMap<>();
            errMap.put("reply", "I am currently undergoing maintenance. Please try again shortly.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errMap);
        }
    }
}
