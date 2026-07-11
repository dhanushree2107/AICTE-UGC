package com.aicte.inspection.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "inspection_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InspectionReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inspection_id", nullable = false)
    private Long inspectionId;

    @Column(name = "submitted_by", nullable = false)
    private String submittedBy;

    @Column(name = "deficiencies_found")
    private String deficienciesFound;

    @Column(name = "infrastructure_score")
    private Double infrastructureScore;

    @Column(name = "faculty_score")
    private Double facultyScore;

    private Boolean recommended;

    private String remarks;

    @Column(name = "report_file_path")
    private String reportFilePath;

    @Column(name = "submitted_at", insertable = false, updatable = false)
    private LocalDateTime submittedAt;
}
