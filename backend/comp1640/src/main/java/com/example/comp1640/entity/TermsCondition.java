package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "terms_condition")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TermsCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tc_id")
    private Integer tcId;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer version;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
