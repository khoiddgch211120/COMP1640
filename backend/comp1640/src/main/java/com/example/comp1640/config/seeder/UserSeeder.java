package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Department;
import com.example.comp1640.entity.Role;
import com.example.comp1640.entity.User;
import com.example.comp1640.enums.RoleName;
import com.example.comp1640.repository.DepartmentRepository;
import com.example.comp1640.repository.RoleRepository;
import com.example.comp1640.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private DepartmentRepository deptRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.count() > 5) { // already has admin + some
            System.out.println("Users already seeded.");
            return;
        }

        Role adminRole = roleRepo.findByRoleName(RoleName.ADMIN).orElseThrow();
        Role qaManagerRole = roleRepo.findByRoleName(RoleName.QA_MANAGER).orElseThrow();
        Role deptManagerRole = roleRepo.findByRoleName(RoleName.DEPT_MANAGER).orElseThrow();
        Role headRole = roleRepo.findByRoleName(RoleName.HEAD).orElseThrow();
        Role academicStaffRole = roleRepo.findByRoleName(RoleName.ACADEMIC_STAFF).orElseThrow();
        Role supportRole = roleRepo.findByRoleName(RoleName.SUPPORT_STAFF).orElseThrow();

        List<Department> depts = deptRepo.findAll();
        Department computingDept = depts.stream().filter(d -> d.getDeptName().equals("School of Computing")).findFirst().orElse(null);
        Department businessDept = depts.stream().filter(d -> d.getDeptName().equals("School of Business")).findFirst().orElse(null);
        Department engineeringDept = depts.stream().filter(d -> d.getDeptName().equals("School of Engineering")).findFirst().orElse(null);
        Department healthDept = depts.stream().filter(d -> d.getDeptName().equals("School of Health")).findFirst().orElse(null);
        Department qaDept = depts.stream().filter(d -> d.getDeptName().equals("QA Department")).findFirst().orElse(null);
        Department hrDept = depts.stream().filter(d -> d.getDeptName().equals("HR Department")).findFirst().orElse(null);
        Department financeDept = depts.stream().filter(d -> d.getDeptName().equals("Finance Department")).findFirst().orElse(null);

        List<User> users = List.of(
                createUser("QA Manager", "qa.manager@greenwich.edu.vn", qaManagerRole, qaDept, "QA"),
                createUser("Business School Manager", "business.manager@greenwich.edu.vn", deptManagerRole,
                        businessDept, "MANAGEMENT"),
                createUser("Computing Head", "computing.head@greenwich.edu.vn", headRole, computingDept, "ACADEMIC"),
                createUser("Lecturer Alice", "alice.lecturer@greenwich.edu.vn", academicStaffRole, computingDept,
                        "ACADEMIC"),
                createUser("Staff Jane", "jane.support@greenwich.edu.vn", supportRole, healthDept, "SUPPORT"),
                createUser("Lec Bob", "bob.lecturer@greenwich.edu.vn", academicStaffRole, engineeringDept, "ACADEMIC"),
                createUser("HR Manager", "hr@greenwich.edu.vn",
                        roleRepo.findByRoleName(RoleName.HR_MANAGER).orElse(adminRole), hrDept, "HR"),
                // double data
                createUser("QA Coord", "qa.coord@greenwich.edu.vn", qaManagerRole, qaDept, "QA"),
                createUser("Eng Manager", "eng.manager@greenwich.edu.vn", deptManagerRole, engineeringDept,
                        "MANAGEMENT"),
                createUser("Health Head", "health.head@greenwich.edu.vn", headRole, healthDept, "ACADEMIC"),
                createUser("Staff David", "david.staff@greenwich.edu.vn", academicStaffRole, businessDept, "SUPPORT"),
                createUser("Lec Eve", "eve.lecturer@greenwich.edu.vn", academicStaffRole, computingDept, "ACADEMIC"),
                createUser("Finance Mgr", "finance@greenwich.edu.vn", deptManagerRole, financeDept, "HR"));

        // filter null depts if not found yet
        List<User> toSave = users.stream().filter(u -> u.getDepartment() != null || true).toList(); // allow null dept

        userRepo.saveAll(toSave);
        System.out.println("Seeded " + toSave.size() + " additional users.");
    }

    private User createUser(String name, String email, Role role, Department dept, String staffType) {
        if (userRepo.existsByEmail(email))
            return null;

        return User.builder()
                .fullName(name)
                .email(email)
                .passwordHash(passwordEncoder.encode("password123"))
                .role(role)
                .department(dept)
                .staffType(staffType)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
