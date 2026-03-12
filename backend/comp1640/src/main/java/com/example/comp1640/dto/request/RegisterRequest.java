package com.example.comp1640.dto.request;

import com.example.comp1640.enums.StaffType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private StaffType staffType;
}
