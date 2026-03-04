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

    // Chỉ ADMIN mới được tạo user
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<UserResponse> create(@RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    // Chỉ ADMIN mới xem được tất cả user
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<List<UserResponse>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<UserResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<UserResponse> update(
            @PathVariable Integer id,
            @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    // Xóa hẳn user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Kích hoạt / vô hiệu hóa user
    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MGR')")
    public ResponseEntity<Void> toggleActive(@PathVariable Integer id) {
        userService.toggleActive(id);
        return ResponseEntity.noContent().build();
    }
}
