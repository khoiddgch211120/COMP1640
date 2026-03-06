package com.example.comp1640.dto.request;
import jakarta.validation.constraints.NotBlank;
public record CommentRequest(@NotBlank String content, Boolean isAnonymous) {}
