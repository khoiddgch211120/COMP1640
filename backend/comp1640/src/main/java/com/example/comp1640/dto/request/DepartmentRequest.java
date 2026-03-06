package com.example.comp1640.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DepartmentRequest {

    private String deptName;
    private String deptType; // qa_dept, faculty, hr_dept, other_dept
}