package com.example.comp1640.entity;

import com.example.comp1640.enums.RoleName;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private RoleName roleName;

    @Column(length = 255)
    private String description;
}
