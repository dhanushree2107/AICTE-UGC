package com.aicte.application.repository;

import com.aicte.application.entity.Application;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    @Cacheable(value = "applications", key = "#refNo")
    Optional<Application> findByRefNo(String refNo);

    List<Application> findByInstituteId(Long instituteId);

    @Override
    @CacheEvict(value = "applications", key = "#result.refNo")
    <S extends Application> S save(S entity);
}
