package com.example.comp1640.service;

import java.util.List;

import com.example.comp1640.dto.request.CategoryRequest;
import com.example.comp1640.dto.response.CategoryResponse;

public interface CategoryService {

    CategoryResponse create(CategoryRequest request);

    List<CategoryResponse> getAll();

    CategoryResponse getById(Integer id);

    CategoryResponse update(Integer id, CategoryRequest request);

    void delete(Integer id);
}
