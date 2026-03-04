package com.example.comp1640.controller;

import com.example.comp1640.dto.AcademicYearDTO;
import com.example.comp1640.service.AcademicYearService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic-years")
@RequiredArgsConstructor
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    @GetMapping
    public ResponseEntity<List<AcademicYearDTO>> getAllAcademicYears() {
        List<AcademicYearDTO> academicYears = academicYearService.getAllAcademicYears();
        return ResponseEntity.ok(academicYears);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicYearDTO> getAcademicYearById(@PathVariable Integer id) {
        AcademicYearDTO academicYear = academicYearService.getAcademicYearById(id);
        return ResponseEntity.ok(academicYear);
    }

    @PostMapping
    public ResponseEntity<AcademicYearDTO> createAcademicYear(
            @RequestBody AcademicYearDTO dto,
            @RequestParam(defaultValue = "1") Integer userId) {
        AcademicYearDTO created = academicYearService.createAcademicYear(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicYearDTO> updateClosureDates(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        LocalDate ideaClosureDate = request.get("ideaClosureDate") != null ? 
                LocalDate.parse(request.get("ideaClosureDate")) : null;
        LocalDate finalClosureDate = request.get("finalClosureDate") != null ? 
                LocalDate.parse(request.get("finalClosureDate")) : null;
        
        AcademicYearDTO updated = academicYearService.updateClosureDates(id, 
                ideaClosureDate != null ? ideaClosureDate.atStartOfDay() : null,
                finalClosureDate != null ? finalClosureDate.atStartOfDay() : null);
        return ResponseEntity.ok(updated);
    }
}

