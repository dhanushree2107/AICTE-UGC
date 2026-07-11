package com.aicte.institute.repository;

import com.aicte.institute.entity.UGProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UGProgramRepository extends JpaRepository<UGProgram, Long> {
    List<UGProgram> findByDepartmentId(Long departmentId);
}
