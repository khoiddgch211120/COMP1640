package com.example.comp1640.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class TermsConditionsRequest {

    // version được tự động set trong Service (không nhận từ client)
    private String content;
    private LocalDate effectiveDate;
}