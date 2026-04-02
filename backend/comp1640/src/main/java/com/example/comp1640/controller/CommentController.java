package com.example.comp1640.controller;

import com.example.comp1640.dto.request.CommentRequest;
import com.example.comp1640.dto.response.CommentResponse;
import com.example.comp1640.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import org.springframework.data.domain.Page;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // Đăng bình luận cho một ý tưởng
    @PostMapping("/ideas/{ideaId}/comments")
    public ResponseEntity<CommentResponse> add(
            @PathVariable Integer ideaId,
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.add(ideaId, request));
    }

    // Lấy danh sách bình luận của một ý tưởng (mới nhất trước)
    @GetMapping("/ideas/{ideaId}/comments")
    public ResponseEntity<List<CommentResponse>> getByIdea(@PathVariable Integer ideaId) {
        return ResponseEntity.ok(commentService.getByIdea(ideaId));
    }

    // Bình luận mới nhất toàn hệ thống (có phân trang)
    @GetMapping("/comments/latest")
    public ResponseEntity<Page<CommentResponse>> getLatest(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(commentService.getLatest(page, size));
    }

    // Sửa bình luận (chỉ chủ comment)
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> update(
            @PathVariable Integer commentId,
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.update(commentId, request));
    }

    // Xóa bình luận (chủ comment hoặc ADMIN)
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Integer commentId) {
        commentService.delete(commentId);
        return ResponseEntity.noContent().build();
    }
}
