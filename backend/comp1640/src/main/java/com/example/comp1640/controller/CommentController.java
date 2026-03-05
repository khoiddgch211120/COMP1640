package com.example.comp1640.controller;

import com.example.comp1640.dto.request.CommentRequest;
import com.example.comp1640.dto.response.CommentResponse;
import com.example.comp1640.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // Đăng bình luận cho một ý tưởng
    @PostMapping("/ideas/{ideaId}/comments")
    public ResponseEntity<CommentResponse> add(
            @PathVariable Integer ideaId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.add(ideaId, request));
    }

    // Lấy danh sách bình luận của một ý tưởng (mới nhất trước)
    @GetMapping("/ideas/{ideaId}/comments")
    public ResponseEntity<List<CommentResponse>> getByIdea(@PathVariable Integer ideaId) {
        return ResponseEntity.ok(commentService.getByIdea(ideaId));
    }

    // Bình luận mới nhất toàn hệ thống
    @GetMapping("/comments/latest")
    public ResponseEntity<List<CommentResponse>> getLatest() {
        return ResponseEntity.ok(commentService.getLatest());
    }

    // Sửa bình luận (chỉ chủ comment)
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> update(
            @PathVariable Integer commentId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.update(commentId, request));
    }

    // Xóa bình luận (chủ comment hoặc ADMIN)
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Integer commentId) {
        commentService.delete(commentId);
        return ResponseEntity.ok().build();
    }
}
