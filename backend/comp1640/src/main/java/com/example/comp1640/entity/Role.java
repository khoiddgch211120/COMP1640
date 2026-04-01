package com.example.comp1640.entity;

import com.example.comp1640.enums.RoleName;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotNull(message = "Tên vai trò không được phép null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private RoleName roleName;

    @Size(max = 255, message = "Mô tả không được vượt quá 255 ký tự")
    @Column(length = 255)
    private String description;
}
