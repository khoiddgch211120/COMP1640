package com.example.comp1640.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.comp1640.dto.request.IdeaRequest;
import com.example.comp1640.dto.response.IdeaResponse;
import com.example.comp1640.service.IdeaService;

@RestController
@RequestMapping("/ideas")
public class IdeaController {

    private final IdeaService ideaService;

    public IdeaController(IdeaService ideaService) {
        this.ideaService = ideaService;
    }

    // Tất cả user đã đăng nhập đều submit được
    @PostMapping
    public ResponseEntity<IdeaResponse> submit(@RequestBody IdeaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ideaService.submit(request));
    }

    // Lấy danh sách, lọc theo yearId và/hoặc deptId
    @GetMapping
    public ResponseEntity<List<IdeaResponse>> getAll(
            @RequestParam(required = false) Integer yearId,
            @RequestParam(required = false) Integer deptId) {
        return ResponseEntity.ok(ideaService.getAll(yearId, deptId));
    }

    // Lấy theo id (tăng view_count)
    @GetMapping("/{id}")
    public ResponseEntity<IdeaResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ideaService.getById(id));
    }

    // Chủ idea sửa (trong hạn idea_closure_date)
    @PutMapping("/{id}")
    public ResponseEntity<IdeaResponse> update(
            @PathVariable Integer id,
            @RequestBody IdeaRequest request) {
        return ResponseEntity.ok(ideaService.update(id, request));
    }

    // Chủ idea hoặc ADMIN xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ideaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Most viewed theo năm học
    @GetMapping("/most-viewed")
    public ResponseEntity<List<IdeaResponse>> getMostViewed(
            @RequestParam Integer yearId) {
        return ResponseEntity.ok(ideaService.getMostViewed(yearId));
    }
}
