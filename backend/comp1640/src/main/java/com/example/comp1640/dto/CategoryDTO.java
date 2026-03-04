package com.example.comp1640.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Integer categoryId;
    private String categoryName;
    private String description;
    private Boolean isUsed;
    private LocalDateTime createdAt;
    private String createdByName;
}

