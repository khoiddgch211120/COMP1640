package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Role;
import com.example.comp1640.enums.RoleName;
import com.example.comp1640.repository.RoleRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class RoleSeeder implements CommandLineRunner {

   @Autowired
   private RoleRepository roleRepo;

   @Override
   public void run(String... args) throws Exception {
      if (roleRepo.count() > 0) {
         System.out.println("Roles already seeded.");
         return;
      }

      List<Role> roles = List.of(
            createRole(RoleName.ADMIN, "Quản trị viên hệ thống - toàn quyền"),
            createRole(RoleName.QA_MANAGER, "Quản lý QA - phân công công việc QA"),
            createRole(RoleName.QA_COORDINATOR, "Điều phối QA - hỗ trợ QA Manager"),
            createRole(RoleName.DEPT_MANAGER, "Quản lý bộ phận - quản lý ideas của bộ phận"),
            createRole(RoleName.HR_MANAGER, "Quản lý HR - quản lý nhân sự"),
            createRole(RoleName.HEAD, "Trưởng bộ phận - lãnh đạo bộ phận"),
            createRole(RoleName.ACADEMIC_STAFF, "Nhân viên học thuật - submit ideas"),
            createRole(RoleName.SUPPORT_STAFF, "Nhân viên hỗ trợ - support users"));

      roleRepo.saveAll(roles);
      System.out.println("Seeded " + roles.size() + " roles.");
   }

   private Role createRole(RoleName name, String description) {
      Role role = new Role();
      role.setRoleName(name);
      role.setDescription(description);
      return role;
   }
}
