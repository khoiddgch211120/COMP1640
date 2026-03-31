package com.example.comp1640.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.comp1640.dto.request.UserRequest;
import com.example.comp1640.dto.response.UserResponse;
import com.example.comp1640.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<UserResponse> create(@RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<List<UserResponse>> getAll(
            @RequestParam(required = false) Integer deptId) {
        return ResponseEntity.ok(userService.getAll(deptId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<UserResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    // PUT giữ nguyên để tương thích
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<UserResponse> update(
            @PathVariable Integer id,
            @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    // PATCH thêm mới — frontend admin dùng PATCH để update thông tin user
    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<UserResponse> patch(
            @PathVariable Integer id,
            @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Toggle active — frontend gọi PATCH /users/:id/toggle-active
    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<Void> toggleActive(@PathVariable Integer id) {
        userService.toggleActive(id);
        return ResponseEntity.noContent().build();
    }
}