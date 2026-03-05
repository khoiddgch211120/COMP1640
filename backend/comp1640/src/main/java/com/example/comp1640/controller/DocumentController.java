package com.example.comp1640.controller;

import com.example.comp1640.dto.response.DocumentResponse;
import com.example.comp1640.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/ideas/{ideaId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    // Upload file đính kèm cho ý tưởng (chỉ chủ idea)
    @Operation(summary = "Upload file đính kèm cho idea")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> upload(
            @PathVariable Integer ideaId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(documentService.upload(ideaId, file));
    }

    // Lấy danh sách file đính kèm của một ý tưởng
    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getByIdea(@PathVariable Integer ideaId) {
        return ResponseEntity.ok(documentService.getByIdea(ideaId));
    }

    // Xóa file đính kèm (chủ idea hoặc ADMIN)
    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer ideaId,
            @PathVariable Integer documentId) {
        documentService.delete(documentId);
        return ResponseEntity.ok().build();
    }
}
