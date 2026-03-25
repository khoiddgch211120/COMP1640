package com.example.comp1640.dto.response;

public class RegisterResponse {

    private String message;

    public RegisterResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}