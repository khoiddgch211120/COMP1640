package com.example.comp1640.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.comp1640.dto.request.DepartmentRequest;
import com.example.comp1640.dto.response.DepartmentResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.entity.Department;
import com.example.comp1640.enums.DeptType;
import com.example.comp1640.repository.DepartmentRepository;
import com.example.comp1640.service.DepartmentService;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepo;

    public DepartmentServiceImpl(DepartmentRepository departmentRepo) {
        this.departmentRepo = departmentRepo;
    }

    @Override
    public DepartmentResponse create(DepartmentRequest request) {

        if (request.getDeptName() == null || request.getDeptName().isBlank()) {
            throw new BadRequestException("Tên phòng ban không được để trống");
        }

        Department dept = new Department();
        dept.setDeptName(request.getDeptName());
        dept.setDeptType(request.getDeptType() != null ? DeptType.valueOf(request.getDeptType()) : DeptType.ACADEMIC);
        dept.setCreatedAt(LocalDateTime.now());

        return toResponse(departmentRepo.save(dept));
    }

    @Override
    public List<DepartmentResponse> getAll() {
        return departmentRepo.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse getById(Integer id) {
        Department dept = departmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban với id: " + id));
        return toResponse(dept);
    }

    @Override
    public DepartmentResponse update(Integer id, DepartmentRequest request) {
        Department dept = departmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban với id: " + id));

        if (request.getDeptName() != null && !request.getDeptName().isBlank()) {
            dept.setDeptName(request.getDeptName());
        }

        if (request.getDeptType() != null) {
            dept.setDeptType(DeptType.valueOf(request.getDeptType()));
        }

        return toResponse(departmentRepo.save(dept));
    }

    @Override
    public void delete(Integer id) {
        if (!departmentRepo.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy phòng ban với id: " + id);
        }
        departmentRepo.deleteById(id);
    }

    // Helper: convert entity -> response
    private DepartmentResponse toResponse(Department dept) {
        return new DepartmentResponse(
                dept.getDeptId(),
                dept.getDeptName(),
                dept.getDeptType(),
                dept.getCreatedAt());
    }
}
