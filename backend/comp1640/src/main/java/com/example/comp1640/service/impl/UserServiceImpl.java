package com.example.comp1640.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.comp1640.dto.request.UserRequest;
import com.example.comp1640.dto.response.UserResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.model.Department;
import com.example.comp1640.model.Role;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.DepartmentRepository;
import com.example.comp1640.repository.RoleRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final DepartmentRepository deptRepo;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepo,
            RoleRepository roleRepo,
            DepartmentRepository deptRepo,
            PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.deptRepo = deptRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse create(UserRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã tồn tại");
        }

        Role role = roleRepo.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy role với id: " + request.getRoleId()));

        Department dept = deptRepo.findById(request.getDeptId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy department với id: " + request.getDeptId()));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStaffType(request.getStaffType());
        user.setRole(role);
        user.setDepartment(dept);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return toResponse(userRepo.save(user));
    }

    @Override
    public List<UserResponse> getAll() {
        return userRepo.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getById(Integer id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với id: " + id));
        return toResponse(user);
    }

    @Override
    public UserResponse update(Integer id, UserRequest request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với id: " + id));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        if (request.getStaffType() != null && !request.getStaffType().isBlank()) {
            user.setStaffType(request.getStaffType());
        }

        if (request.getRoleId() != null) {
            Role role = roleRepo.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy role với id: " + request.getRoleId()));
            user.setRole(role);
        }

        if (request.getDeptId() != null) {
            Department dept = deptRepo.findById(request.getDeptId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy department với id: " + request.getDeptId()));
            user.setDepartment(dept);
        }

        user.setUpdatedAt(LocalDateTime.now());

        return toResponse(userRepo.save(user));
    }

    @Override
    public void delete(Integer id) {
        if (!userRepo.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy user với id: " + id);
        }
        userRepo.deleteById(id);
    }

    @Override
    public void toggleActive(Integer id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với id: " + id));
        user.setIsActive(!user.getIsActive());
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);
    }

    // Helper: convert entity -> response
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getStaffType(),
                user.getIsActive(),
                user.getRole() != null ? user.getRole().getRoleName() : null,
                user.getDepartment() != null ? user.getDepartment().getDeptName() : null,
                user.getCreatedAt()
        );
    }
}