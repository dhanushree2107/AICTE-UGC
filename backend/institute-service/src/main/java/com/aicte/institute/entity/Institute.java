package com.aicte.institute.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "institutes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Institute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    @Column(name = "pin_code", nullable = false)
    private String pinCode;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String website;

    @Column(name = "established_year")
    private Integer establishedYear;

    @Column(name = "institution_type")
    private String institutionType; // Govt, Govt-Aided, Self-Financing

    @Column(name = "created_by")
    private String createdBy; // Reference to Keycloak user ID

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
