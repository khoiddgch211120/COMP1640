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
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(4)
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
                if (userRepo.count() > 10) { // already has admin + some
                        System.out.println("Users already seeded.");
                        return;
                }

                Role adminRole = roleRepo.findByRoleName(RoleName.ADMIN).orElseThrow();
                Role qaManagerRole = roleRepo.findByRoleName(RoleName.QA_MANAGER).orElseThrow();
                Role qaCoordRole = roleRepo.findByRoleName(RoleName.QA_COORDINATOR).orElseThrow();
                Role deptManagerRole = roleRepo.findByRoleName(RoleName.DEPT_MANAGER).orElseThrow();
                Role hrManagerRole = roleRepo.findByRoleName(RoleName.HR_MANAGER).orElseThrow();
                Role headRole = roleRepo.findByRoleName(RoleName.HEAD).orElseThrow();
                Role academicStaffRole = roleRepo.findByRoleName(RoleName.ACADEMIC_STAFF).orElseThrow();
                Role supportRole = roleRepo.findByRoleName(RoleName.SUPPORT_STAFF).orElseThrow();

                List<Department> depts = deptRepo.findAll();
                Department computingDept = findDept(depts, "School of Computing");
                Department businessDept = findDept(depts, "School of Business");
                Department engineeringDept = findDept(depts, "School of Engineering");
                Department healthDept = findDept(depts, "School of Health");
                Department qaDept = findDept(depts, "QA Department");
                Department hrDept = findDept(depts, "HR Department");
                Department financeDept = findDept(depts, "Finance Department");
                Department marketingDept = findDept(depts, "Marketing");
                Department itSupportDept = findDept(depts, "IT Support");
                Department researchDept = findDept(depts, "Research Center");

                List<User> users = List.of(
                                // Admin
                                createUser("System Admin", "admin@greenwich.edu.vn", adminRole, qaDept, "ADMIN"),
                                // QA Management (3-4 users)
                                createUser("QA Manager", "qa.manager@greenwich.edu.vn", qaManagerRole, qaDept, "QA"),
                                createUser("QA Coordinator 1", "qa.coord1@greenwich.edu.vn", qaCoordRole, qaDept, "QA"),
                                createUser("QA Coordinator 2", "qa.coord2@greenwich.edu.vn", qaCoordRole, qaDept, "QA"),
                                // HR Management
                                createUser("HR Manager", "hr.manager@greenwich.edu.vn", hrManagerRole, hrDept, "HR"),
                                createUser("HR Staff", "hr.staff@greenwich.edu.vn", supportRole, hrDept, "HR"),
                                // School Heads (5)
                                createUser("Computing School Head", "computing.head@greenwich.edu.vn", headRole,
                                                computingDept, "ACADEMIC"),
                                createUser("Business School Head", "business.head@greenwich.edu.vn", headRole,
                                                businessDept, "ACADEMIC"),
                                createUser("Engineering School Head", "engineering.head@greenwich.edu.vn", headRole,
                                                engineeringDept, "ACADEMIC"),
                                createUser("Health School Head", "health.head@greenwich.edu.vn", headRole, healthDept,
                                                "ACADEMIC"),
                                createUser("Research Center Head", "research.head@greenwich.edu.vn", headRole,
                                                researchDept, "ACADEMIC"),
                                // Department Managers (4)
                                createUser("Computing Dept Manager", "computing.manager@greenwich.edu.vn",
                                                deptManagerRole, computingDept, "MANAGEMENT"),
                                createUser("Business Dept Manager", "business.manager@greenwich.edu.vn",
                                                deptManagerRole, businessDept, "MANAGEMENT"),
                                createUser("Engineering Dept Manager", "engineering.manager@greenwich.edu.vn",
                                                deptManagerRole, engineeringDept, "MANAGEMENT"),
                                createUser("Finance Dept Manager", "finance.manager@greenwich.edu.vn", deptManagerRole,
                                                financeDept, "MANAGEMENT"),
                                // Computing School Lecturers (6)
                                createUser("Dr. Alice Johnson", "alice.johnson@greenwich.edu.vn", academicStaffRole,
                                                computingDept, "ACADEMIC"),
                                createUser("Dr. Bob Smith", "bob.smith@greenwich.edu.vn", academicStaffRole,
                                                computingDept, "ACADEMIC"),
                                createUser("Dr. Chen Wei", "chen.wei@greenwich.edu.vn", academicStaffRole,
                                                computingDept, "ACADEMIC"),
                                createUser("Mr. David Brown", "david.brown@greenwich.edu.vn", academicStaffRole,
                                                computingDept, "ACADEMIC"),
                                createUser("Ms. Emma Wilson", "emma.wilson@greenwich.edu.vn", academicStaffRole,
                                                computingDept, "ACADEMIC"),
                                createUser("Dr. Frank Lee", "frank.lee@greenwich.edu.vn", academicStaffRole,
                                                computingDept, "ACADEMIC"),
                                // Business School Lecturers (5)
                                createUser("Dr. Grace Miller", "grace.miller@greenwich.edu.vn", academicStaffRole,
                                                businessDept, "ACADEMIC"),
                                createUser("Dr. Henry Davis", "henry.davis@greenwich.edu.vn", academicStaffRole,
                                                businessDept, "ACADEMIC"),
                                createUser("Ms. Iris Taylor", "iris.taylor@greenwich.edu.vn", academicStaffRole,
                                                businessDept, "ACADEMIC"),
                                createUser("Mr. Jack Anderson", "jack.anderson@greenwich.edu.vn", academicStaffRole,
                                                businessDept, "ACADEMIC"),
                                createUser("Dr. Karen Thomas", "karen.thomas@greenwich.edu.vn", academicStaffRole,
                                                businessDept, "ACADEMIC"),
                                // Engineering School Lecturers (5)
                                createUser("Dr. Leo Nguyen", "leo.nguyen@greenwich.edu.vn", academicStaffRole,
                                                engineeringDept, "ACADEMIC"),
                                createUser("Dr. Maria Garcia", "maria.garcia@greenwich.edu.vn", academicStaffRole,
                                                engineeringDept, "ACADEMIC"),
                                createUser("Mr. Nathan White", "nathan.white@greenwich.edu.vn", academicStaffRole,
                                                engineeringDept, "ACADEMIC"),
                                createUser("Dr. Olivia Martinez", "olivia.martinez@greenwich.edu.vn", academicStaffRole,
                                                engineeringDept, "ACADEMIC"),
                                createUser("Mr. Peter Harris", "peter.harris@greenwich.edu.vn", academicStaffRole,
                                                engineeringDept, "ACADEMIC"),
                                // Health School Lecturers (4)
                                createUser("Dr. Quinn Clark", "quinn.clark@greenwich.edu.vn", academicStaffRole,
                                                healthDept, "ACADEMIC"),
                                createUser("Dr. Rita Lewis", "rita.lewis@greenwich.edu.vn", academicStaffRole,
                                                healthDept, "ACADEMIC"),
                                createUser("Ms. Sophie Walker", "sophie.walker@greenwich.edu.vn", academicStaffRole,
                                                healthDept, "ACADEMIC"),
                                createUser("Dr. Theo Young", "theo.young@greenwich.edu.vn", academicStaffRole,
                                                healthDept, "ACADEMIC"),
                                // Support Staff (5)
                                createUser("IT Support 1", "it.support1@greenwich.edu.vn", supportRole, itSupportDept,
                                                "SUPPORT"),
                                createUser("IT Support 2", "it.support2@greenwich.edu.vn", supportRole, itSupportDept,
                                                "SUPPORT"),
                                createUser("Library Staff", "library.staff@greenwich.edu.vn", supportRole, null,
                                                "SUPPORT"),
                                createUser("Marketing Staff", "marketing.staff@greenwich.edu.vn", supportRole,
                                                marketingDept, "SUPPORT"),
                                createUser("Finance Staff", "finance.staff@greenwich.edu.vn", supportRole, financeDept,
                                                "SUPPORT"));

                List<User> toSave = users.stream().filter(u -> u.getEmail() != null).toList();
                userRepo.saveAll(toSave);
                System.out.println("Seeded " + toSave.size() + " additional users.");
        }

        private Department findDept(List<Department> depts, String name) {
                return depts.stream().filter(d -> d.getDeptName().equals(name)).findFirst().orElse(null);
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
