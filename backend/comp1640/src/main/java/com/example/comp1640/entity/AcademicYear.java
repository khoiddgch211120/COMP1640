package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "academic_year")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer yearId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false, length = 20)
    private String yearLabel;          // e.g. "2024-2025"

    @Column(nullable = false)
    private LocalDate ideaClosureDate;

    @Column(nullable = false)
    private LocalDate finalClosureDate;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
