package com.example.comp1640.service.impl;

import com.example.comp1640.dto.request.LoginRequest;
import com.example.comp1640.dto.request.RegisterRequest;
import com.example.comp1640.dto.response.LoginResponse;
import com.example.comp1640.dto.response.RegisterResponse;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.security.JwtTokenUtil;
import com.example.comp1640.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepo;
        private final PasswordEncoder passwordEncoder;
        private final JwtTokenUtil jwtUtil;

        public AuthServiceImpl(
                        UserRepository userRepo,
                        PasswordEncoder passwordEncoder,
                        JwtTokenUtil jwtUtil) {
                this.userRepo = userRepo;
                this.passwordEncoder = passwordEncoder;
                this.jwtUtil = jwtUtil;
        }

        @Override
        public RegisterResponse register(RegisterRequest request) {

                if (userRepo.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email đã tồn tại");
                }

                User user = new User();
                user.setFullName(request.getFullName());
                user.setEmail(request.getEmail());
                user.setPasswordHash(
                                passwordEncoder.encode(request.getPassword()));
                user.setIsActive(true);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());

                userRepo.save(user);

                return new RegisterResponse("Đăng ký thành công");
        }

        @Override
        public LoginResponse login(LoginRequest request) {

                User user = userRepo.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

                if (!passwordEncoder.matches(
                                request.getPassword(),
                                user.getPasswordHash())) {
                        throw new RuntimeException("Sai mật khẩu");
                }

                String token = jwtUtil.generateToken(user.getEmail());

                return new LoginResponse(token, user.getEmail());
        }
}