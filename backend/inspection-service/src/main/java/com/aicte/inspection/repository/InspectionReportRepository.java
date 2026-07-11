package com.aicte.inspection.repository;

import com.aicte.inspection.entity.InspectionReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InspectionReportRepository extends JpaRepository<InspectionReport, Long> {
    Optional<InspectionReport> findByInspectionId(Long inspectionId);
}
