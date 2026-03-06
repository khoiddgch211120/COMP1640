package com.example.comp1640.dto.response;

import com.example.comp1640.entity.AcademicYear;
import java.time.LocalDate;

public record AcademicYearResponse(
    Integer yearId, String yearLabel,
    LocalDate ideaClosureDate, LocalDate finalClosureDate
) {
    public static AcademicYearResponse from(AcademicYear y) {
        return new AcademicYearResponse(y.getYearId(), y.getYearLabel(),
                y.getIdeaClosureDate(), y.getFinalClosureDate());
    }
}
