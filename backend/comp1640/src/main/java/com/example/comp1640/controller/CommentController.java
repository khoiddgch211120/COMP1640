package com.example.comp1640.controller;

import com.example.comp1640.dto.request.CommentRequest;
import com.example.comp1640.dto.response.CommentResponse;
import com.example.comp1640.service.impl.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /** GET /ideas/{id}/comments */
    @GetMapping("/ideas/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getByIdea(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.getByIdeaId(id));
    }

    /** POST /ideas/{id}/comments */
    @PostMapping("/ideas/{id}/comments")
    public ResponseEntity<CommentResponse> create(@PathVariable Integer id,
                                                  @Valid @RequestBody CommentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.create(id, req));
    }

    /** GET /comments/latest?page=0&size=5 */
    @GetMapping("/comments/latest")
    public ResponseEntity<Page<CommentResponse>> getLatest(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(commentService.getLatest(page, size));
    }
}
