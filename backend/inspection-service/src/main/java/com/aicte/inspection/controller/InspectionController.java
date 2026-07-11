package com.aicte.inspection.controller;

import com.aicte.inspection.entity.Inspection;
import com.aicte.inspection.entity.InspectionReport;
import com.aicte.inspection.repository.InspectionReportRepository;
import com.aicte.inspection.repository.InspectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping
public class InspectionController {

    @Autowired
    private InspectionRepository inspectionRepository;

    @Autowired
    private InspectionReportRepository inspectionReportRepository;

    @PostMapping("/api/inspections")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REGIONAL_OFFICER')")
    public ResponseEntity<Inspection> scheduleInspection(@RequestBody Inspection inspection) {
        inspection.setStatus("SCHEDULED");
        return ResponseEntity.ok(inspectionRepository.save(inspection));
    }

    @GetMapping("/api/inspections/application/{applicationId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_COLLEGE_ADMIN', 'ROLE_REGIONAL_OFFICER')")
    public ResponseEntity<List<Inspection>> getInspections(@PathVariable Long applicationId) {
        return ResponseEntity.ok(inspectionRepository.findByApplicationId(applicationId));
    }

    @PostMapping("/api/inspection/report")
    @PreAuthorize("hasAnyRole('ROLE_INSPECTION_COMMITTEE', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<InspectionReport> submitReport(@RequestBody InspectionReport report, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        report.setSubmittedBy(username);
        InspectionReport savedReport = inspectionReportRepository.save(report);

        // Update corresponding inspection status
        Optional<Inspection> inspOpt = inspectionRepository.findById(report.getInspectionId());
        if (inspOpt.isPresent()) {
            Inspection inspection = inspOpt.get();
            inspection.setStatus("COMPLETED");
            inspectionRepository.save(inspection);
        }

        return ResponseEntity.ok(savedReport);
    }

    @GetMapping("/api/inspections/reports/{inspectionId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_REGIONAL_OFFICER')")
    public ResponseEntity<InspectionReport> getReportByInspectionId(@PathVariable Long inspectionId) {
        return inspectionReportRepository.findByInspectionId(inspectionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
