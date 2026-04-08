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

                List<User> users = userRepo.findAll();
                if (users.size() < 3) {
                        System.out.println("Not enough users for seeding ideas.");
                        return;
                }

                List<Department> depts = deptRepo.findAll();
                // Get departments by index (from DepartmentSeeder: 0=Business, 1=Computing,
                // 2=Engineering, 3=Health)
                Department businessDept = depts.size() > 0 ? depts.get(0) : null;
                Department computingDept = depts.size() > 1 ? depts.get(1) : null;
                Department engineeringDept = depts.size() > 2 ? depts.get(2) : null;
                Department healthDept = depts.size() > 3 ? depts.get(3) : null;

                // Debug: log departments found
                System.out.println("Business: " + (businessDept != null ? businessDept.getDeptName() : "NOT FOUND"));
                System.out.println("Computing: " + (computingDept != null ? computingDept.getDeptName() : "NOT FOUND"));
                System.out.println("Engineering: "
                                + (engineeringDept != null ? engineeringDept.getDeptName() : "NOT FOUND"));
                System.out.println("Health: " + (healthDept != null ? healthDept.getDeptName() : "NOT FOUND"));

                List<AcademicYear> years = yearRepo.findAll();
                if (years.isEmpty()) {
                        System.out.println("No academic years found.");
                        return;
                }

                List<Category> cats = catRepo.findAll();
                if (cats.size() < 3) {
                        System.out.println("Not enough categories for seeding ideas.");
                        return;
                }

                AcademicYear currentYear = years.get(0);
                AcademicYear nextYear = years.size() > 1 ? years.get(1) : currentYear;

                List<Idea> ideas = List.of(
                                // Computing Department Ideas (10)
                                createIdea("Triển khai AI tự động test",
                                                "Sử dụng ML để auto generate test cases và validate logic...",
                                                users.get(5), computingDept, currentYear, subList(cats, 0, 3), false),
                                createIdea("Cải tiến CI/CD pipeline",
                                                "Tích hợp GitHub Actions với SonarQube và optimize deployment time...",
                                                users.get(6), computingDept, currentYear, subList(cats, 1, 4), true),
                                createIdea("Microservices migration",
                                                "Chuyển monolithic sang microservices architecture...",
                                                users.get(7), computingDept, nextYear, subList(cats, 2, 5), false),
                                createIdea("Implement Kubernetes orchestration",
                                                "Deploy apps using K8s for better scalability...",
                                                users.get(8), computingDept, currentYear, subList(cats, 3, 6), false),
                                createIdea("GraphQL API implementation",
                                                "Replace REST with GraphQL cho hiệu suất tốt hơn...",
                                                users.get(9), computingDept, currentYear, subList(cats, 0, 3), true),
                                createIdea("Docker containerization", "Containerize tất cả services để dễ deploy...",
                                                users.get(5), computingDept, nextYear, subList(cats, 1, 4), false),
                                createIdea("Automated security scanning",
                                                "Implement SAST/DAST tools trong CI/CD pipeline...",
                                                users.get(10), computingDept, currentYear, subList(cats, 4, 7), false),
                                createIdea("Machine Learning integration",
                                                "Thêm ML models vào product recommendations...",
                                                users.get(6), computingDept, currentYear, subList(cats, 0, 3), true),
                                createIdea("Real-time notification system",
                                                "Implement WebSocket cho real-time updates...",
                                                users.get(7), computingDept, nextYear, subList(cats, 2, 5), false),
                                createIdea("Database performance optimization",
                                                "Optimize queries and add indexing strategy...",
                                                users.get(8), computingDept, currentYear, subList(cats, 1, 4), false),

                                // Business Department Ideas (8)
                                createIdea("Ứng dụng low-code platform",
                                                "Giảm thời gian phát triển features với low-code solution...",
                                                users.get(17), businessDept, currentYear, subList(cats, 2, 5), false),
                                createIdea("Business intelligence dashboard",
                                                "Dashboard analytics untuk better decision making...",
                                                users.get(18), businessDept, currentYear, subList(cats, 3, 6), false),
                                createIdea("CRM system implementation",
                                                "Implement CRM to manage customer relationships...",
                                                users.get(19), businessDept, nextYear, subList(cats, 0, 3), true),
                                createIdea("Supply chain optimization", "Optimize supply chain processes với AI...",
                                                users.get(20), businessDept, currentYear, subList(cats, 1, 4), false),
                                createIdea("E-commerce platform upgrade",
                                                "Migrate old e-commerce platform to modern stack...",
                                                users.get(21), businessDept, currentYear, subList(cats, 2, 5), false),
                                createIdea("Marketing automation tool",
                                                "Implement automation untuk marketing campaigns...",
                                                users.get(17), businessDept, nextYear, subList(cats, 3, 6), true),
                                createIdea("Mobile app for customers",
                                                "Develop mobile app để tăng customer engagement...",
                                                users.get(18), businessDept, currentYear, subList(cats, 0, 3), false),
                                createIdea("Financial reporting system",
                                                "Centralized system cho financial reporting...",
                                                users.get(19), businessDept, currentYear, subList(cats, 1, 4), false),

                                // Engineering Department Ideas (7)
                                createIdea("IoT sensor network", "Deploy IoT sensors cho monitoring infrastructure...",
                                                users.get(26), engineeringDept, currentYear, subList(cats, 2, 5),
                                                false),
                                createIdea("Renewable energy tracking",
                                                "System to track renewable energy production...",
                                                users.get(27), engineeringDept, currentYear, subList(cats, 3, 6), true),
                                createIdea("Smart building automation",
                                                "Automate building systems cho energy efficiency...",
                                                users.get(28), engineeringDept, nextYear, subList(cats, 0, 3), false),
                                createIdea("Predictive maintenance system",
                                                "ML-based system untuk maintenance prediction...",
                                                users.get(29), engineeringDept, currentYear, subList(cats, 1, 4),
                                                false),
                                createIdea("3D design software integration", "Integrate CAD software vào workflow...",
                                                users.get(30), engineeringDept, currentYear, subList(cats, 2, 5), true),
                                createIdea("Equipment monitoring platform",
                                                "Real-time monitoring platform cho equipment...",
                                                users.get(26), engineeringDept, nextYear, subList(cats, 3, 6), false),
                                createIdea("Quality assurance automation",
                                                "Automate QA processes trong manufacturing...",
                                                users.get(27), engineeringDept, currentYear, subList(cats, 0, 3),
                                                false),

                                // Health Department Ideas (5)
                                createIdea("Telemedicine platform", "Develop platform cho remote consultations...",
                                                users.get(32), healthDept, currentYear, subList(cats, 1, 4), false),
                                createIdea("Patient health monitoring", "Wearable integration cho health monitoring...",
                                                users.get(33), healthDept, currentYear, subList(cats, 2, 5), true),
                                createIdea("Medical records digitization", "Digitalize all medical records securely...",
                                                users.get(34), healthDept, nextYear, subList(cats, 3, 6), false),
                                createIdea("AI diagnosis assistant", "AI-assisted diagnostic tool cho doctors...",
                                                users.get(35), healthDept, currentYear, subList(cats, 0, 3), false),
                                createIdea("Appointment scheduling system",
                                                "Efficient scheduling system cho patients...",
                                                users.get(32), healthDept, currentYear, subList(cats, 1, 4), true),

                                // General/Cross-department Ideas (4)
                                createIdea("Universal accessibility", "Improve accessibility theo WCAG guidelines...",
                                                users.get(11), null, currentYear, subList(cats, 2, 5), false),
                                createIdea("Blockchain integration", "Sử dụng blockchain cho transparency...",
                                                users.get(12), null, nextYear, subList(cats, 3, 6), true),
                                createIdea("Community engagement platform", "Platform để tăng community engagement...",
                                                users.get(13), null, currentYear, subList(cats, 0, 3), false),
                                createIdea("Sustainability initiatives",
                                                "Environmental friendly practices implementation...",
                                                users.get(14), null, currentYear, subList(cats, 1, 4), false));

                ideaRepo.saveAll(ideas);
                System.out.println("Seeded " + ideas.size() + " ideas.");
        }

        private Department findDept(List<Department> depts, String name) {
                return depts.stream().filter(d -> d.getDeptName().equals(name)).findFirst().orElse(null);
        }

        private Set<Category> subList(List<Category> cats, int start, int end) {
                if (cats.size() < end) {
                        end = cats.size();
                }
                return new HashSet<>(cats.subList(start, end));
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
