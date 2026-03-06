package com.example.comp1640.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AcademicYearRequest(
    @NotBlank String yearLabel,
    @NotNull  LocalDate ideaClosureDate,
    @NotNull  LocalDate finalClosureDate
) {}
