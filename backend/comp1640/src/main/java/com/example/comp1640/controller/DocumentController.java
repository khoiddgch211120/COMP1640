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
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @Operation(summary = "Upload file đính kèm cho idea")
    @PostMapping(value = "/upload/{ideaId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> upload(
            @PathVariable Integer ideaId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(documentService.upload(ideaId, file));
    }

    @GetMapping("/idea/{ideaId}")
    public ResponseEntity<List<DocumentResponse>> getByIdea(@PathVariable Integer ideaId) {
        return ResponseEntity.ok(documentService.getByIdea(ideaId));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> delete(@PathVariable Integer documentId) {
        documentService.delete(documentId);
        return ResponseEntity.ok().build();
    }
}
