package com.example.comp1640.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "department")
@Getter
@Setter
@NoArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dept_id")
    private Integer deptId;

    @NotBlank(message = "Tên bộ phận không được để trống")
    @Size(min = 2, max = 100, message = "Tên bộ phận phải từ 2 đến 100 ký tự")
    @Column(name = "dept_name")
    private String deptName;

    @Size(max = 50, message = "Loại bộ phận không được vượt quá 50 ký tự")
    @Column(name = "dept_type")
    private String deptType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}