package com.example.comp1640.dto.request;

import com.example.comp1640.enums.DeptType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DepartmentRequest {

    private String deptName;
    private DeptType deptType;
}
