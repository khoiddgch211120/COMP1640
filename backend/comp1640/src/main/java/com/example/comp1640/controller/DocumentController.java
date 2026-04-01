package com.example.comp1640.controller;

import com.example.comp1640.dto.response.DocumentResponse;
import com.example.comp1640.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    // Upload file đính kèm cho ý tưởng (chỉ chủ idea)
    @Operation(summary = "Upload file đính kèm cho idea")
    @PostMapping(value = "/ideas/{ideaId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> upload(
            @PathVariable Integer ideaId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.upload(ideaId, file));
    }

    // Lấy danh sách file đính kèm của một ý tưởng
    @GetMapping("/ideas/{ideaId}/documents")
    public ResponseEntity<List<DocumentResponse>> getByIdea(@PathVariable Integer ideaId) {
        return ResponseEntity.ok(documentService.getByIdea(ideaId));
    }

    // Xóa file đính kèm đơn lẻ (chủ idea hoặc ADMIN)
    @DeleteMapping("/ideas/{ideaId}/documents/{documentId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer ideaId,
            @PathVariable Integer documentId) {
        documentService.delete(documentId);
        return ResponseEntity.noContent().build();
    }

    // GET tất cả documents — dùng cho trang AttachmentManagement của Admin
    @GetMapping("/documents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DocumentResponse>> getAll() {
        return ResponseEntity.ok(documentService.getAll());
    }

    // DELETE đơn lẻ theo doc_id — dùng cho AttachmentManagement
    @DeleteMapping("/documents/{documentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteById(@PathVariable Integer documentId) {
        documentService.delete(documentId);
        return ResponseEntity.noContent().build();
    }

    // DELETE bulk — frontend gửi { doc_ids: [1, 2, 3] }
    @DeleteMapping("/documents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBulk(@RequestBody Map<String, List<Integer>> body) {
        List<Integer> docIds = body.get("doc_ids");
        if (docIds != null) {
            docIds.forEach(documentService::delete);
        }
        return ResponseEntity.noContent().build();
    }
}