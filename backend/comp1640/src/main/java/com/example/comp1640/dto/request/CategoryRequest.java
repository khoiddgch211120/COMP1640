package com.example.comp1640.dto.request;
import jakarta.validation.constraints.NotBlank;
public record CategoryRequest(@NotBlank String categoryName, String description) {}
