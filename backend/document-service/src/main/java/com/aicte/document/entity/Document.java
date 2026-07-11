package com.aicte.document.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "document_type", nullable = false)
    private String documentType; // Land Document, Building Plan, Faculty List, Audit Report

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "file_size")
    private Integer fileSize;

    @Column(name = "ocr_extracted_text")
    private String ocrExtractedText;

    @Column(name = "ai_verification_status")
    private String aiVerificationStatus = "PENDING"; // PENDING, VERIFIED, SUSPICIOUS, BLURRY

    @Column(name = "ai_feedback")
    private String aiFeedback;

    @Column(name = "uploaded_at", insertable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
