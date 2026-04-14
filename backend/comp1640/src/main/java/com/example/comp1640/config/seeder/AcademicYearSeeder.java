package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.AcademicYear;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.AcademicYearRepository;
import com.example.comp1640.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(5)
public class AcademicYearSeeder implements CommandLineRunner {

    @Autowired
    private AcademicYearRepository yearRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public void run(String... args) throws Exception {
        if (yearRepo.count() > 0) {
            System.out.println("AcademicYears already seeded.");
            return;
        }

        User adminOrQa = userRepo.findByEmail("admin@greenwich.edu.vn").orElse(
                userRepo.findAll().isEmpty() ? null : userRepo.findAll().get(0));

        if (adminOrQa == null) {
            System.out.println("No admin user found for academic year seeding.");
            return;
        }

        yearRepo.saveAll(java.util.List.of(
                createYear("2024-2025", LocalDate.of(2025, 3, 31), LocalDate.of(2025, 4, 30), adminOrQa),
                createYear("2023-2024", LocalDate.of(2024, 3, 31), LocalDate.of(2024, 4, 30), adminOrQa),
                createYear("2025-2026", LocalDate.of(2026, 3, 31), LocalDate.of(2026, 4, 30), adminOrQa),
                createYear("2022-2023", LocalDate.of(2023, 3, 31), LocalDate.of(2023, 4, 30), adminOrQa),
                createYear("2026-2027", LocalDate.of(2027, 3, 31), LocalDate.of(2027, 4, 30), adminOrQa)));

        System.out.println("Seeded 5 academic years.");
    }

    private AcademicYear createYear(String label, LocalDate ideaClose, LocalDate finalClose, User createdBy) {
        AcademicYear year = new AcademicYear();
        year.setYearLabel(label);
        year.setIdeaClosureDate(ideaClose);
        year.setFinalClosureDate(finalClose);
        year.setCreatedBy(createdBy);
        year.setCreatedAt(LocalDateTime.now());
        return year;
    }
}
