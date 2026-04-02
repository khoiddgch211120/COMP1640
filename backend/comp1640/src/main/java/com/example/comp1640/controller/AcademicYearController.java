package com.example.comp1640.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import com.example.comp1640.dto.request.AcademicYearRequest;
import com.example.comp1640.dto.response.AcademicYearResponse;
import com.example.comp1640.service.AcademicYearService;

@RestController
@RequestMapping("/academic-years")
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    public AcademicYearController(AcademicYearService academicYearService) {
        this.academicYearService = academicYearService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicYearResponse> create(@Valid @RequestBody AcademicYearRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(academicYearService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<AcademicYearResponse>> getAll() {
        return ResponseEntity.ok(academicYearService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicYearResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(academicYearService.getById(id));
    }

    @GetMapping("/current")
    public ResponseEntity<AcademicYearResponse> getCurrent() {
        return ResponseEntity.ok(academicYearService.getCurrent());
    }

    // PUT giữ nguyên để tương thích
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicYearResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody AcademicYearRequest request) {
        return ResponseEntity.ok(academicYearService.update(id, request));
    }

    // PATCH thêm mới — frontend admin dùng PATCH (chỉ final_closure_date)
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicYearResponse> patch(
            @PathVariable Integer id,
            @Valid @RequestBody AcademicYearRequest request) {
        return ResponseEntity.ok(academicYearService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        academicYearService.delete(id);
        return ResponseEntity.noContent().build();
    }
}