package com.aicte.inspection.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "inspections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inspection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, CANCELLED

    @Column(name = "committee_members")
    private String committeeMembers; // JSON string or comma-separated names

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
