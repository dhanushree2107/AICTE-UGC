package com.aicte.approval.controller;

import com.aicte.approval.entity.Approval;
import com.aicte.approval.repository.ApprovalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approval")
public class ApprovalController {

    @Autowired
    private ApprovalRepository approvalRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REGIONAL_OFFICER')")
    public ResponseEntity<Approval> submitDecision(@RequestBody Approval approval, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        approval.setApprovedBy(username);
        
        // Generate simulated Approval Order path
        if ("APPROVED".equalsIgnoreCase(approval.getDecision())) {
            approval.setApprovalOrderPath("/documents/orders/ApprovalOrder_" + approval.getApplicationId() + ".pdf");
        }

        Approval savedApproval = approvalRepository.save(approval);
        return ResponseEntity.ok(savedApproval);
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_REGIONAL_OFFICER', 'ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<List<Approval>> getApprovalsByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(approvalRepository.findByApplicationId(applicationId));
    }
}
