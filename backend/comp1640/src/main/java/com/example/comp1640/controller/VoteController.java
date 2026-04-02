package com.example.comp1640.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import com.example.comp1640.dto.request.VoteRequest;
import com.example.comp1640.dto.response.VoteResponse;
import com.example.comp1640.service.VoteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ideas")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/{id}/vote")
    public ResponseEntity<VoteResponse> vote(
            @PathVariable Integer id,
            @Valid @RequestBody VoteRequest request) {
        return ResponseEntity.ok(voteService.vote(id, request));
    }

    @GetMapping("/{id}/vote")
    public ResponseEntity<VoteResponse> getVotes(@PathVariable Integer id) {
        return ResponseEntity.ok(voteService.getVotes(id));
    }

    @DeleteMapping("/{id}/vote")
    public ResponseEntity<Void> deleteVote(@PathVariable Integer id) {
        voteService.deleteVote(id);
        return ResponseEntity.noContent().build();
    }
}
