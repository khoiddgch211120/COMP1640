package com.example.comp1640.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRequest {

    private String fullName;
    private String email;
    private String password;
    private String staffType;
    private Integer roleId;
    private Integer deptId;
}