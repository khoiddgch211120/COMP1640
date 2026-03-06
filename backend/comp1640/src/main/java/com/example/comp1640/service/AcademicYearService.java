package com.example.comp1640.service;

import java.util.List;

import com.example.comp1640.dto.request.AcademicYearRequest;
import com.example.comp1640.dto.response.AcademicYearResponse;

public interface AcademicYearService {

    AcademicYearResponse create(AcademicYearRequest request);

    List<AcademicYearResponse> getAll();

    AcademicYearResponse getById(Integer id);

    AcademicYearResponse getCurrent();

    AcademicYearResponse update(Integer id, AcademicYearRequest request);

    void delete(Integer id);
}
