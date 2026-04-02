package com.example.comp1640.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    private String fullName;
    private String email;
    private String password;
    private String staffType;
    private Integer roleId;
    private Integer deptId;
}