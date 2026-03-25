package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.TermsCondition;
import com.example.comp1640.repository.TermsConditionRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TermsConditionSeeder implements CommandLineRunner {

    @Autowired
    private TermsConditionRepository termsRepo;  // Assume exists or add if not

    @Override
    public void run(String... args) throws Exception {
        if (termsRepo.count() > 0) {
            System.out.println("TermsConditions already seeded.");
            return;
        }

        List<TermsCondition> terms = List.of(
            createTerms("<p>&amp;nbsp;Người dùng cam kết không chia sẻ ý tưởng vi phạm pháp luật.</p>", 1, LocalDate.of(2024, 1, 1)),
            createTerms("<p>&amp;nbsp;Ý tưởng thuộc sở hữu tập thể, không được sử dụng thương mại cá nhân.</p>", 2, LocalDate.of(2024, 6, 1))
        );

        termsRepo.saveAll(terms);
        System.out.println("Seeded " + terms.size() + " terms conditions.");
    }

    private TermsCondition createTerms(String content, Integer version, LocalDate effectiveDate) {
        return TermsCondition.builder()
            .content(content)
            .version(version)
            .effectiveDate(effectiveDate)
            .build();
    }
}

