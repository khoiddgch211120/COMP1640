package com.example.comp1640.dto.response;

public class LoginResponse {

    private String token;
    private String email;
    private String role;
    private Integer departmentId;

    public LoginResponse(String token, String email, String role, Integer departmentId) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.departmentId = departmentId;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getRole()  { return role; }
    public Integer getDepartmentId() { return departmentId; }
}