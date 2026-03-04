package com.example.comp1640.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.comp1640.dto.request.LoginRequest;
import com.example.comp1640.dto.request.RegisterRequest;
import com.example.comp1640.dto.response.LoginResponse;
import com.example.comp1640.dto.response.RegisterResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.exception.UnauthorizedException;
import com.example.comp1640.model.Role;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.RoleRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.security.JwtTokenUtil;
import com.example.comp1640.security.TokenBlacklistService;
import com.example.comp1640.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepo;
        private final RoleRepository roleRepo;
        private final PasswordEncoder passwordEncoder;
        private final JwtTokenUtil jwtUtil;
        private final TokenBlacklistService blacklistService;

        public AuthServiceImpl(
                        UserRepository userRepo,
                        RoleRepository roleRepo,
                        PasswordEncoder passwordEncoder,
                        JwtTokenUtil jwtUtil,
                        TokenBlacklistService blacklistService) {
                this.userRepo = userRepo;
                this.roleRepo = roleRepo;
                this.passwordEncoder = passwordEncoder;
                this.jwtUtil = jwtUtil;
                this.blacklistService = blacklistService;
        }

        @Override
        public RegisterResponse register(RegisterRequest request) {

                if (userRepo.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email đã tồn tại");
                }

                Role defaultRole = roleRepo.findByRoleName("ACADEMIC")
                        .orElseGet(() -> {
                                Role r = new Role();
                                r.setRoleName("ACADEMIC");
                                r.setDescription("Default role for registered users");
                                return roleRepo.save(r);
                        });

                User user = new User();
                user.setFullName(request.getFullName());
                user.setEmail(request.getEmail());
                user.setPasswordHash(
                                passwordEncoder.encode(request.getPassword()));
                user.setRole(defaultRole);
                user.setIsActive(true);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());

                userRepo.save(user);

                return new RegisterResponse("Đăng ký thành công");
        }

        @Override
        public LoginResponse login(LoginRequest request) {

                User user = userRepo.findByEmail(request.getEmail())
                                .orElseThrow(() -> new ResourceNotFoundException("Email không tồn tại"));

                if (Boolean.FALSE.equals(user.getIsActive())) {
                        throw new UnauthorizedException("Tài khoản đã bị vô hiệu hóa");
                }

                if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                        throw new BadRequestException("Sai mật khẩu");
                }

                String token = jwtUtil.generateToken(user.getEmail());
                String role = user.getRole() != null ? user.getRole().getRoleName() : null;

                return new LoginResponse(token, user.getEmail(), role);
        }

        @Override
        public void logout(String token) {
                blacklistService.blacklist(token);
        }
}