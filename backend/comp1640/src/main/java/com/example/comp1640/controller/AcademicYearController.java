package com.example.comp1640.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    // Chỉ ADMIN tạo năm học
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicYearResponse> create(@RequestBody AcademicYearRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(academicYearService.create(request));
    }

    // Tất cả user đã đăng nhập xem được
    @GetMapping
    public ResponseEntity<List<AcademicYearResponse>> getAll() {
        return ResponseEntity.ok(academicYearService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicYearResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(academicYearService.getById(id));
    }

    // Lấy năm học hiện tại đang hoạt động
    @GetMapping("/current")
    public ResponseEntity<AcademicYearResponse> getCurrent() {
        return ResponseEntity.ok(academicYearService.getCurrent());
    }

    // ADMIN cập nhật closure date
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicYearResponse> update(
            @PathVariable Integer id,
            @RequestBody AcademicYearRequest request) {
        return ResponseEntity.ok(academicYearService.update(id, request));
    }

    // ADMIN xóa năm học
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        academicYearService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
