package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "academic_year")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "year_id")
    private Integer yearId;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "year_label")
    private String yearLabel;

    @Column(name = "idea_closure_date")
    private LocalDate ideaClosureDate;

    @Column(name = "final_closure_date")
    private LocalDate finalClosureDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
