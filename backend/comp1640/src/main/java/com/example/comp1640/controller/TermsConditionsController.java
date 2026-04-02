package com.example.comp1640.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@RequestMapping("/terms")
public class TermsConditionsController {

    private final TermsConditionsService termsService;

    public TermsConditionsController(TermsConditionsService termsService) {
        this.termsService = termsService;
    }

    // Public: ai cũng xem được điều khoản hiện tại
    @GetMapping
    public ResponseEntity<TermsConditionsResponse> getLatest() {
        return ResponseEntity.ok(termsService.getLatest());
    }

    // Chỉ ADMIN mới được tạo/cập nhật điều khoản
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<TermsConditionsResponse> create(
            @Valid @RequestBody TermsConditionsRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(termsConditionsService.create(request));
    }

    // User đã đăng nhập xác nhận đồng ý điều khoản
    @PostMapping("/accept")
    public ResponseEntity<Void> accept() {
        termsService.accept();
        return ResponseEntity.noContent().build();
    }
}
