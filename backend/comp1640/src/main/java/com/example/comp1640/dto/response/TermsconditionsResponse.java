package com.example.comp1640.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TermsConditionsResponse {

    // Khớp với frontend: tc_id, version, content, effective_date, created_at
    private Integer tcId;
    private Integer version;
    private String content;
    private LocalDate effectiveDate;
    private LocalDateTime createdAt;
}