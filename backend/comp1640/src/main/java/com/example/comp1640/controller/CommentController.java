package com.example.comp1640.controller;

import com.example.comp1640.dto.request.CommentRequest;
import com.example.comp1640.dto.response.CommentResponse;
import com.example.comp1640.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/idea/{ideaId}")
    public ResponseEntity<CommentResponse> add(
            @PathVariable Integer ideaId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.add(ideaId, request));
    }

    @GetMapping("/idea/{ideaId}")
    public ResponseEntity<List<CommentResponse>> getByIdea(@PathVariable Integer ideaId) {
        return ResponseEntity.ok(commentService.getByIdea(ideaId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> update(
            @PathVariable Integer commentId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.update(commentId, request));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Integer commentId) {
        commentService.delete(commentId);
        return ResponseEntity.ok().build();
    }
}
