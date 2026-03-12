package com.example.comp1640.dto.response;

import java.time.LocalDateTime;

import com.example.comp1640.enums.DeptType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {

    private Integer deptId;
    private String deptName;
    private DeptType deptType;
    private LocalDateTime createdAt;
}
