package com.example.comp1640.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TermsConditionsResponse {

    private Integer termsId;
    private Integer version;
    private String content;
    private LocalDate effectiveDate;
    private String createdByName;
    private LocalDateTime createdAt;
}
