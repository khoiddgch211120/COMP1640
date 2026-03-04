package com.example.comp1640.controller;

import com.example.comp1640.dto.CreateIdeaRequest;
import com.example.comp1640.dto.IdeaDTO;
import com.example.comp1640.dto.UpdateIdeaRequest;
import com.example.comp1640.service.IdeaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
@RequiredArgsConstructor
public class IdeaController {

    private final IdeaService ideaService;

    @GetMapping
    public ResponseEntity<Page<IdeaDTO>> getAllIdeas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Page<IdeaDTO> ideas = ideaService.getAllIdeas(page, size);
        return ResponseEntity.ok(ideas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IdeaDTO> getIdeaById(@PathVariable Integer id) {
        IdeaDTO idea = ideaService.getIdeaById(id);
        return ResponseEntity.ok(idea);
    }

    @PostMapping
    public ResponseEntity<IdeaDTO> createIdea(
            @ModelAttribute CreateIdeaRequest request,
            @RequestParam(defaultValue = "1") Integer userId,
            @RequestParam(required = false) List<MultipartFile> files) {
        IdeaDTO created = ideaService.createIdea(request, userId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IdeaDTO> updateIdea(
            @PathVariable Integer id,
            @RequestBody UpdateIdeaRequest request,
            @RequestParam(defaultValue = "1") Integer userId) {
        IdeaDTO updated = ideaService.updateIdea(id, request, userId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/most-popular")
    public ResponseEntity<List<IdeaDTO>> getMostPopularIdeas(
            @RequestParam(defaultValue = "10") int limit) {
        List<IdeaDTO> ideas = ideaService.getMostPopularIdeas(limit);
        return ResponseEntity.ok(ideas);
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<List<IdeaDTO>> getMostViewedIdeas(
            @RequestParam(defaultValue = "10") int limit) {
        List<IdeaDTO> ideas = ideaService.getMostViewedIdeas(limit);
        return ResponseEntity.ok(ideas);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<IdeaDTO>> getLatestIdeas(
            @RequestParam(defaultValue = "10") int limit) {
        List<IdeaDTO> ideas = ideaService.getLatestIdeas(limit);
        return ResponseEntity.ok(ideas);
    }
}

