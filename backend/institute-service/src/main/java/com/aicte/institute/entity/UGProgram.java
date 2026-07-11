package com.aicte.institute.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "ug_programs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UGProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(nullable = false)
    private String name;

    @Column(name = "intake_capacity", nullable = false)
    private Integer intakeCapacity;

    @Column(name = "duration_years")
    private Integer durationYears = 4;

    @Column(name = "nba_accreditation_status")
    private String nbaAccreditationStatus = "Not Accredited";
}
