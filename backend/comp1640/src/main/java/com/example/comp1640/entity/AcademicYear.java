package com.example.comp1640.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "academic_year")
@Getter
@Setter
@NoArgsConstructor
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "year_id")
    private Integer yearId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "year_label", nullable = false, length = 20)
    private String yearLabel;

    @Column(name = "idea_closure_date", nullable = false)
    private LocalDate ideaClosureDate;

    @Column(name = "final_closure_date", nullable = false)
    private LocalDate finalClosureDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
