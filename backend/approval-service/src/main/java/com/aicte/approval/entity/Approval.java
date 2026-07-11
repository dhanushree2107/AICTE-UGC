package com.aicte.approval.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "approvals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Approval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "approved_by", nullable = false)
    private String approvedBy; // Username / ID of Approver

    @Column(nullable = false)
    private String decision; // APPROVED, REJECTED, CLARIFICATION

    private String remarks;

    @Column(name = "approval_order_path")
    private String approvalOrderPath; // Path to generated PDF Approval letter

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
