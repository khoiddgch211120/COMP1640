package com.example.comp1640.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotBlank(message = "Năm học không được để trống")
    @Size(min = 4, max = 20, message = "Năm học phải từ 4 đến 20 ký tự")
    @Column(name = "year_label", nullable = false, length = 20)
    private String yearLabel;

    @NotNull(message = "Ngày đóng ý tưởng không được phép null")
    @Future(message = "Ngày đóng ý tưởng phải là ngày trong tương lai")
    @Column(name = "idea_closure_date", nullable = false)
    private LocalDate ideaClosureDate;

    @NotNull(message = "Ngày đóng cuối cùng không được phép null")
    @Future(message = "Ngày đóng cuối cùng phải là ngày trong tương lai")
    @Column(name = "final_closure_date", nullable = false)
    private LocalDate finalClosureDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
