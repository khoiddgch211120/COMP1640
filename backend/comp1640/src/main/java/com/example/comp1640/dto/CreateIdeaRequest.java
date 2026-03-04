package com.example.comp1640.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateIdeaRequest {
    @NotNull(message = "Academic year is required")
    private Integer yearId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private Boolean isAnonymous = false;
    
    private Boolean termsAccepted = true;
    
    private List<Integer> categoryIds;
}

