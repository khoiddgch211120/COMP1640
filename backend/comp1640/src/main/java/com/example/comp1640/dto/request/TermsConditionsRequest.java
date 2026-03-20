package com.example.comp1640.dto.request;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TermsConditionsRequest {

    private String version;
    private String content;
    private LocalDate effectiveDate;
}
