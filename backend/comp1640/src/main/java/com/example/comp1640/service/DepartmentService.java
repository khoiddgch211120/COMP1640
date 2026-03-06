package com.example.comp1640.service;

import java.util.List;

import com.example.comp1640.dto.request.DepartmentRequest;
import com.example.comp1640.dto.response.DepartmentResponse;

public interface DepartmentService {

    DepartmentResponse create(DepartmentRequest request);

    List<DepartmentResponse> getAll();

    DepartmentResponse getById(Integer id);

    DepartmentResponse update(Integer id, DepartmentRequest request);

    void delete(Integer id);
}