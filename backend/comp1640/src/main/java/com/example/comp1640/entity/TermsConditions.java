package com.example.comp1640.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "terms_conditions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TermsConditions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tc_id")
    private Integer tcId;

    // Auto-increment trong Service, không nhận từ client
    @NotNull(message = "Phiên bản không được phép null")
    @Min(value = 1, message = "Phiên bản phải >= 1")
    @Column(name = "version", nullable = false)
    private Integer version;

    @NotBlank(message = "Nội dung không được để trống")
    @Size(min = 10, max = 10000, message = "Nội dung phải từ 10 đến 10000 ký tự")
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @NotNull(message = "Ngày có hiệu lực không được phép null")
    @PastOrPresent(message = "Ngày có hiệu lực phải là hiện tại hoặc quá khứ")
    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}