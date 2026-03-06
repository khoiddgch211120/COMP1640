package com.example.comp1640.service;

import java.util.List;

import com.example.comp1640.dto.request.UserRequest;
import com.example.comp1640.dto.response.UserResponse;

public interface UserService {

    UserResponse create(UserRequest request);

    List<UserResponse> getAll(Integer deptId);

    UserResponse getById(Integer id);

    UserResponse update(Integer id, UserRequest request);

    void delete(Integer id);

    void toggleActive(Integer id);
}