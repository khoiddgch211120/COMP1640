package com.example.comp1640.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcademicYearDTO {
    private Integer yearId;
    private String yearLabel;
    private LocalDate ideaClosureDate;
    private LocalDate finalClosureDate;
    private LocalDateTime createdAt;
    private String createdByName;
}

