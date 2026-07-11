package com.aicte.institute.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "faculty")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false)
    private String qualification;

    @Column(name = "aadhaar_no", unique = true)
    private String aadhaarNo;

    @Column(name = "pan_no", unique = true)
    private String panNo;

    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears;

    @Column(name = "date_of_joining", nullable = false)
    private LocalDate dateOfJoining;
}
