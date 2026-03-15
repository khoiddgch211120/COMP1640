package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.AcademicYear;
import com.example.comp1640.entity.Category;
import com.example.comp1640.entity.Department;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class IdeaSeeder implements CommandLineRunner {

    @Autowired
    private IdeaRepository ideaRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private AcademicYearRepository yearRepo;
    @Autowired
    private DepartmentRepository deptRepo;
    @Autowired
    private CategoryRepository catRepo;

    @Override
    public void run(String... args) throws Exception {
        if (ideaRepo.count() > 0) {
            System.out.println("Ideas already seeded.");
            return;
        }

        User staff1 = userRepo.findByEmail("john.doe@rikkei.edu.vn").orElse(userRepo.findAll().get(1));
        User staff2 = userRepo.findByEmail("jane.smith@rikkei.edu.vn").orElse(userRepo.findAll().get(2));
        List<Department> depts = deptRepo.findAll();
        Department computingDept = depts.stream().filter(d -> d.getDeptName().equals("School of Computing")).findFirst()
                .orElse(null);
        Department itDept = computingDept;
        AcademicYear currentYear = yearRepo.findAll().get(0); // first year
        List<Category> cats = catRepo.findAll();
        Set<Category> catSet1 = new HashSet<>(cats.subList(0, 3));
        Set<Category> catSet2 = new HashSet<>(cats.subList(3, 6));

        List<Idea> ideas = List.of(
                createIdea("Triển khai AI tự động test", "Sử dụng ML để auto generate test cases...", staff1, itDept,
                        currentYear, catSet1, false),
                createIdea("Cải tiến CI/CD pipeline", "Tích hợp GitHub Actions với SonarQube...", staff2, itDept,
                        currentYear, catSet2, true),
                createIdea("Ứng dụng low-code platform", "Giảm thời gian phát triển...", staff1, null, currentYear,
                        catSet1, false),
                createIdea("Microservices migration", "Chuyển monolithic sang microservices...", staff2, itDept,
                        yearRepo.findAll().get(1), new HashSet<>(cats.subList(1, 4)), false)
        // add more ~15 total, abbreviated
        );

        ideaRepo.saveAll(ideas);
        System.out.println("Seeded " + ideas.size() + " ideas.");
    }

    private Idea createIdea(String title, String content, User user, Department dept, AcademicYear year,
            Set<Category> categories, boolean anonymous) {
        Idea idea = new Idea();
        idea.setTitle(title);
        idea.setContent(content);
        idea.setUser(user);
        idea.setDepartment(dept);
        idea.setAcademicYear(year);
        idea.setCategories(categories);
        idea.setIsAnonymous(anonymous);
        idea.setTermsAccepted(true);
        idea.setSubmittedAt(LocalDateTime.now().minusDays(10));
        idea.setUpdatedAt(LocalDateTime.now());
        return idea;
    }
}
