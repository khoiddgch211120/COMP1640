package com.example.comp1640.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TermsConditionsRequest {

    // version được tự động set trong Service (không nhận từ client)
    private String content;
    private LocalDate effectiveDate;
}