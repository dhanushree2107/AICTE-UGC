package com.aicte.institute.repository;

import com.aicte.institute.entity.Institute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstituteRepository extends JpaRepository<Institute, Long> {
    Optional<Institute> findByCreatedBy(String createdBy);
    List<Institute> findByNameContainingIgnoreCaseOrStateContainingIgnoreCase(String name, String state);
}
