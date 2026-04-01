package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.TermsConditions;
import com.example.comp1640.repository.TermsConditionsRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TermsConditionSeeder implements CommandLineRunner {

    @Autowired
    private TermsConditionsRepository termsRepo; // Assume exists or add if not

    @Override
    public void run(String... args) throws Exception {
        if (termsRepo.count() > 0) {
            System.out.println("TermsConditions already seeded.");
            return;
        }

        List<TermsConditions> terms = List.of(
                createTerms("<h3>Điều khoản sử dụng - Phiên bản 1.0</h3>" +
                        "<p>1. Người dùng cam kết không chia sẻ ý tưởng vi phạm pháp luật.</p>" +
                        "<p>2. Ý tưởng không được chứa nội dung kỳ thị, phân biệt.</p>" +
                        "<p>3. Bảo vệ quyền riêng tư của tất cả người dùng.</p>", 1,
                        LocalDate.of(2024, 1, 1)),
                createTerms("<h3>Điều khoản sử dụng - Phiên bản 1.1</h3>" +
                        "<p>1. Ý tưởng thuộc sở hữu tập thể.</p>" +
                        "<p>2. Không được sử dụng thương mại cá nhân.</p>" +
                        "<p>3. Quyền tác giả được bảo vệ.</p>" +
                        "<p>4. Hỗ trợ quốc tế lưu ý về IP.</p>", 2,
                        LocalDate.of(2024, 6, 1)),
                createTerms("<h3>Điều khoản sử dụng - Phiên bản 2.0</h3>" +
                        "<p>1. Privacy Policy update - GDPR compliant.</p>" +
                        "<p>2. Data security standards enhanced.</p>" +
                        "<p>3. Third party integrations allowed with consent.</p>" +
                        "<p>4. Analytics and monitoring for improvement.</p>", 3,
                        LocalDate.of(2025, 1, 1)),
                createTerms("<h3>Community Guidelines - Version 2.5</h3>" +
                        "<p>1. Respectful communication required.</p>" +
                        "<p>2. No spam or promotional content.</p>" +
                        "<p>3. Intellectual property rights respected.</p>" +
                        "<p>4. Moderation policies enforced.</p>", 4,
                        LocalDate.of(2025, 6, 1)));

        termsRepo.saveAll(terms);
        System.out.println("Seeded " + terms.size() + " terms conditions.");
    }

    private TermsConditions createTerms(String content, Integer version, LocalDate effectiveDate) {
        return TermsConditions.builder()
                .content(content)
                .version(version)
                .effectiveDate(effectiveDate)
                .build();
    }
}
