package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Category;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.CategoryRepository;
import com.example.comp1640.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CategorySeeder implements CommandLineRunner {

   @Autowired
   private CategoryRepository categoryRepo;

   @Autowired
   private UserRepository userRepo;

   @Override
   public void run(String... args) throws Exception {
      if (categoryRepo.count() > 0) {
         System.out.println("Categories already seeded.");
         return;
      }

      User qaManager = userRepo.findByEmail("qa.manager@rikkei.edu.vn").orElse(
            userRepo.findByEmail("admin@gmail.com").orElseThrow());

      List<Category> categories = List.of(
            createCategory("Cải tiến quy trình", "Tối ưu hóa workflow nội bộ", qaManager),
            createCategory("Đổi mới công nghệ", "Áp dụng AI/ML mới", qaManager),
            createCategory("Cải thiện môi trường", "Không gian làm việc xanh", qaManager),
            createCategory("Tăng cường đào tạo", "Chương trình upskill", qaManager),
            createCategory("Tối ưu chi phí", "Giảm chi phí vận hành", qaManager),
            createCategory("Cải thiện chất lượng code", "Best practices coding", qaManager),
            createCategory("Hỗ trợ nhân viên", "Chính sách phúc lợi", qaManager),
            createCategory("Tự động hóa", "Automation tools", qaManager),
            createCategory("Security enhancement", "Bảo mật hệ thống", qaManager),
            createCategory("UX/UI cải tiến", "Giao diện thân thiện", qaManager));

      categoryRepo.saveAll(categories);
      System.out.println("Seeded " + categories.size() + " categories.");
   }

   private Category createCategory(String name, String desc, User createdBy) {
      Category cat = new Category();
      cat.setCategoryName(name);
      cat.setDescription(desc);
      cat.setIsUsed(true);
      cat.setCreatedBy(createdBy);
      cat.setCreatedAt(LocalDateTime.now());
      return cat;
   }
}
