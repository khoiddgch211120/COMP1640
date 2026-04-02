package com.example.comp1640.dto.request;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcademicYearRequest {

    private String yearLabel;
    private LocalDate ideaClosureDate;
    private LocalDate finalClosureDate;
}
