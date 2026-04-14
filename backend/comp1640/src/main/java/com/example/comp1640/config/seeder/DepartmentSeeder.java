package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Department;
import com.example.comp1640.enums.DeptType;
import com.example.comp1640.repository.DepartmentRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(3)
public class DepartmentSeeder implements CommandLineRunner {

    @Autowired
    private DepartmentRepository departmentRepo;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepo.count() > 0) {
            System.out.println("Departments already seeded.");
            return;
        }

        List<Department> depts = List.of(
                createDept("School of Business", DeptType.FACULTY),
                createDept("School of Computing", DeptType.FACULTY),
                createDept("School of Engineering", DeptType.FACULTY),
                createDept("School of Health", DeptType.FACULTY),
                createDept("Academic Department", DeptType.OTHER_DEPT),
                createDept("HR Department", DeptType.HR_DEPT),
                createDept("QA Department", DeptType.QA_DEPT),
                createDept("Student Services", DeptType.OTHER_DEPT),
                createDept("Finance Department", DeptType.HR_DEPT),
                createDept("IT Support", DeptType.QA_DEPT),
                createDept("Marketing", DeptType.OTHER_DEPT),
                createDept("Research Center", DeptType.FACULTY),
                createDept("Library Services", DeptType.OTHER_DEPT),
                createDept("Admissions Office", DeptType.HR_DEPT),
                createDept("International Office", DeptType.OTHER_DEPT),
                createDept("Vietnam Campus Admin", DeptType.QA_DEPT));

        departmentRepo.saveAll(depts);
        System.out.println("Seeded " + depts.size() + " departments.");
    }

    private Department createDept(String name, DeptType type) {
        Department dept = new Department();
        dept.setDeptName(name);
        dept.setDeptType(type.name());
        dept.setCreatedAt(LocalDateTime.now());
        return dept;
    }
}
