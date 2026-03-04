package com.example.comp1640.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateIdeaRequest {
    private String title;
    private String content;
    private List<Integer> categoryIds;
}

