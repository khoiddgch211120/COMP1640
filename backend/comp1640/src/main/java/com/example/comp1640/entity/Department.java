package com.example.comp1640.entity;

import com.example.comp1640.enums.DeptType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "department")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer deptId;

    @Column(nullable = false, length = 255)
    private String deptName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeptType deptType;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
