package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.AcademicYear;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.AcademicYearRepository;
import com.example.comp1640.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
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

        User adminOrQa = userRepo.findByEmail("admin@gmail.com").orElse(
                userRepo.findAll().get(0));

        yearRepo.saveAll(java.util.List.of(
                createYear("2023-2024", LocalDate.of(2024, 5, 15), LocalDate.of(2024, 6, 30), adminOrQa),
                createYear("2024-2025", LocalDate.of(2025, 5, 10), LocalDate.of(2025, 6, 25), adminOrQa),
                createYear("2022-2023", LocalDate.of(2023, 5, 20), LocalDate.of(2023, 7, 5), adminOrQa)));

        System.out.println("Seeded 3 academic years.");
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
