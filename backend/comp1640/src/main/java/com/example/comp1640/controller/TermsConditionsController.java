package com.example.comp1640.controller;

import com.example.comp1640.dto.request.TermsConditionsRequest;
import com.example.comp1640.dto.response.TermsConditionsResponse;
import com.example.comp1640.service.TermsConditionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/terms-conditions")
@RequiredArgsConstructor
public class TermsConditionsController {

    private final TermsConditionsService termsConditionsService;

    // GET tất cả versions — trang TermsConditions của Admin
    @GetMapping
    public ResponseEntity<List<TermsConditionsResponse>> getAll() {
        return ResponseEntity.ok(termsConditionsService.getAll());
    }

    // GET version hiện tại (version cao nhất)
    @GetMapping("/current")
    public ResponseEntity<TermsConditionsResponse> getCurrent() {
        return ResponseEntity.ok(termsConditionsService.getCurrent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TermsConditionsResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(termsConditionsService.getById(id));
    }

    // POST tạo version mới — chỉ ADMIN
    // Body: { content, effective_date }
    // version được tự động tăng trong Service
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TermsConditionsResponse> create(
            @Valid @RequestBody TermsConditionsRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(termsConditionsService.create(request));
    }
}