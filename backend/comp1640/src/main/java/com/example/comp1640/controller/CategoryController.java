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

import com.example.comp1640.dto.request.CategoryRequest;
import com.example.comp1640.dto.response.CategoryResponse;
import com.example.comp1640.service.CategoryService;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ADMIN và QA_MANAGER được tạo category
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER')")
    public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(request));
    }

    // Tất cả user đã đăng nhập đều xem được
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    // ADMIN và QA_MANAGER được sửa
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER')")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Integer id,
            @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    // ADMIN và QA_MANAGER được xóa (chỉ khi chưa dùng)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
