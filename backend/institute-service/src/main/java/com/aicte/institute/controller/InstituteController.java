package com.aicte.institute.controller;

import com.aicte.institute.entity.*;
import com.aicte.institute.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping
public class InstituteController {

    @Autowired
    private InstituteRepository instituteRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UGProgramRepository ugProgramRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private InfrastructureRepository infrastructureRepository;

    // Public API
    @GetMapping("/api/public/approved-institutes")
    public ResponseEntity<List<Institute>> searchInstitutes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String state) {
        if ((search != null && !search.isEmpty()) || (state != null && !state.isEmpty())) {
            return ResponseEntity.ok(instituteRepository.findByNameContainingIgnoreCaseOrStateContainingIgnoreCase(
                    search != null ? search : "", state != null ? state : ""));
        }
        return ResponseEntity.ok(instituteRepository.findAll());
    }

    // Protected APIs
    @GetMapping("/api/institutes/my-institute")
    public ResponseEntity<Map<String, Object>> getMyInstitute(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        Optional<Institute> instituteOpt = instituteRepository.findByCreatedBy(username);
        
        if (instituteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Institute institute = instituteOpt.get();
        return ResponseEntity.ok(buildInstituteDetailsMap(institute));
    }

    @GetMapping("/api/institutes/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_REGIONAL_OFFICER', 'ROLE_INSPECTION_COMMITTEE')")
    public ResponseEntity<Map<String, Object>> getInstituteById(@PathVariable Long id) {
        Optional<Institute> instituteOpt = instituteRepository.findById(id);
        if (instituteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(buildInstituteDetailsMap(instituteOpt.get()));
    }

    @PostMapping("/api/institutes")
    @PreAuthorize("hasRole('ROLE_COLLEGE_ADMIN') or hasRole('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Institute> saveInstitute(@RequestBody Institute institute, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        institute.setCreatedBy(username);
        return ResponseEntity.ok(instituteRepository.save(institute));
    }

    @PostMapping("/api/institutes/departments")
    @PreAuthorize("hasRole('ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<Department> addDepartment(@RequestBody Department dept) {
        return ResponseEntity.ok(departmentRepository.save(dept));
    }

    @PostMapping("/api/institutes/ug-programs")
    @PreAuthorize("hasRole('ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<UGProgram> addUGProgram(@RequestBody UGProgram program) {
        return ResponseEntity.ok(ugProgramRepository.save(program));
    }

    @PostMapping("/api/institutes/faculty")
    @PreAuthorize("hasRole('ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<Faculty> addFaculty(@RequestBody Faculty faculty) {
        return ResponseEntity.ok(facultyRepository.save(faculty));
    }

    @PostMapping("/api/institutes/infrastructure")
    @PreAuthorize("hasRole('ROLE_COLLEGE_ADMIN')")
    public ResponseEntity<Infrastructure> addInfrastructure(@RequestBody Infrastructure infra) {
        return ResponseEntity.ok(infrastructureRepository.save(infra));
    }

    private Map<String, Object> buildInstituteDetailsMap(Institute institute) {
        Map<String, Object> map = new HashMap<>();
        map.put("institute", institute);
        
        List<Department> departments = departmentRepository.findByInstituteId(institute.getId());
        map.put("departments", departments);

        List<Infrastructure> infra = infrastructureRepository.findByInstituteId(institute.getId());
        map.put("infrastructure", infra);

        for (Department dept : departments) {
            map.put("programs_dept_" + dept.getId(), ugProgramRepository.findByDepartmentId(dept.getId()));
            map.put("faculty_dept_" + dept.getId(), facultyRepository.findByDepartmentId(dept.getId()));
        }

        return map;
    }
}
