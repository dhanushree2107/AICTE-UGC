package com.aicte.document.controller;

import com.aicte.document.entity.Document;
import com.aicte.document.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("applicationId") Long applicationId,
            @RequestParam("documentType") String documentType) {
        
        // Simulating writing to disk / cloud storage
        String fileName = file.getOriginalFilename();
        String filePath = "/uploads/" + applicationId + "/" + fileName;

        Document doc = new Document();
        doc.setApplicationId(applicationId);
        doc.setDocumentType(documentType);
        doc.setFileName(fileName);
        doc.setFilePath(filePath);
        doc.setMimeType(file.getContentType());
        doc.setFileSize((int) file.getSize());
        doc.setAiVerificationStatus("PENDING");

        Document savedDoc = documentRepository.save(doc);
        return ResponseEntity.ok(savedDoc);
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<List<Document>> getDocumentsByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(documentRepository.findByApplicationId(applicationId));
    }

    @PutMapping("/{id}/ai-status")
    public ResponseEntity<Document> updateAiStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam String feedback,
            @RequestParam(required = false) String ocrText) {
        Optional<Document> docOpt = documentRepository.findById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Document doc = docOpt.get();
        doc.setAiVerificationStatus(status);
        doc.setAiFeedback(feedback);
        if (ocrText != null) {
            doc.setOcrExtractedText(ocrText);
        }

        return ResponseEntity.ok(documentRepository.save(doc));
    }
}
