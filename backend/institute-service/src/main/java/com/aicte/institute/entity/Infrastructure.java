package com.aicte.institute.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "infrastructure")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Infrastructure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "institute_id", nullable = false)
    private Long instituteId;

    @Column(name = "room_type", nullable = false)
    private String roomType;

    @Column(name = "area_sq_m", nullable = false)
    private Double areaSqM;

    private Integer capacity;

    @Column(name = "wifi_enabled")
    private Boolean wifiEnabled = true;

    @Column(name = "projector_enabled")
    private Boolean projectorEnabled = true;
}
