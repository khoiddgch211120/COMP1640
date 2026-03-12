package com.example.comp1640.config;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.comp1640.entity.Role;
import com.example.comp1640.entity.User;
import com.example.comp1640.enums.RoleName;

import com.example.comp1640.repository.RoleRepository;
import com.example.comp1640.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            RoleRepository roleRepo,
            UserRepository userRepo,
            PasswordEncoder passwordEncoder) {
        this.roleRepo = roleRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedRoles();
        seedAdmin();
    }

    private void seedRoles() {
        Map<String, String> roles = Map.of(
                "ADMIN", "Quản trị hệ thống toàn diện",
                "QA_MANAGER", "Quản lý chất lượng - tạo category, xem báo cáo toàn trường",
                "QA_COORDINATOR", "Điều phối QA - xuất CSV/ZIP, xem báo cáo",
                "DEPT_MANAGER", "Quản lý phòng ban - xem thống kê dept",
                "HR_MANAGER", "Quản lý nhân sự - quản lý tài khoản",
                "HEAD", "Trưởng khoa - xem thống kê faculty",
                "ACADEMIC_STAFF", "Nhân viên học thuật - submit ý tưởng",
                "SUPPORT_STAFF", "Nhân viên hỗ trợ - submit ý tưởng");

        List<Role> toSave = new ArrayList<>();
        roles.forEach((name, desc) -> {
            if (!roleRepo.existsByRoleName(RoleName.valueOf(name))) {
                Role r = new Role();
                r.setRoleName(RoleName.valueOf(name));
                r.setDescription(desc);
                toSave.add(r);
            }
        });

        if (!toSave.isEmpty())
            roleRepo.saveAll(toSave);
    }

    private void seedAdmin() {
        String adminEmail = "admin@gmail.com";

        if (userRepo.existsByEmail(adminEmail))
            return;

        Role adminRole = roleRepo.findByRoleName(RoleName.ADMIN)
                .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

        User admin = new User();
        admin.setFullName("System Admin");
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole(adminRole);
        admin.setStaffType("MANAGEMENT");
        admin.setIsActive(true);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        userRepo.save(admin);
        System.out.println(" Admin created: " + adminEmail);
    }
}