package com.aicte.application.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ref_no", unique = true, nullable = false)
    private String refNo;

    @Column(name = "institute_id", nullable = false)
    private Long instituteId;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    @Column(name = "submission_date", insertable = false, updatable = false)
    private LocalDateTime submissionDate;

    @Column(name = "overall_status")
    private String overallStatus = "SUBMITTED"; // SUBMITTED, UNDER_OCR, INSPECTION_SCHEDULED, REJECTED, APPROVED, CLARIFICATION_REQUIRED

    @Column(name = "ai_eligibility_score")
    private Double aiEligibilityScore;

    @Column(name = "ai_risk_score")
    private Double aiRiskScore;

    @Column(name = "ai_recommendation")
    private String aiRecommendation;

    @Column(name = "ai_reasons")
    private String aiReasons;
}
