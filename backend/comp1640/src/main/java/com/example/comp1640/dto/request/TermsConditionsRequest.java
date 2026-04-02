package com.example.comp1640.dto.request;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import lombok.AllArgsConstructor;
import lombok.Data;

@Getter
@Setter
@Data
@AllArgsConstructor

public class TermsConditionsRequest {

    private String version;
    private String content;
    private LocalDate effectiveDate;
}
