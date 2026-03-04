package com.example.comp1640.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private Integer categoryId;
    private String categoryName;
    private String description;
    private Boolean isUsed;
    private String createdByName;
    private LocalDateTime createdAt;
}
