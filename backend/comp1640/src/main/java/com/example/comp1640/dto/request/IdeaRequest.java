package com.example.comp1640.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record IdeaRequest(
    @NotBlank String title,
    @NotBlank String content,
    Boolean isAnonymous,
    List<Integer> categoryIds
) {}
