package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(9)
public class CommentSeeder implements CommandLineRunner {

   @Autowired
   private CommentRepository commentRepo;

   @Autowired
   private IdeaRepository ideaRepo;

   @Autowired
   private UserRepository userRepo;

   @Override
   public void run(String... args) throws Exception {
      if (commentRepo.count() > 50 || ideaRepo.count() == 0) {
         System.out.println("Comments already seeded or no ideas.");
         return;
      }

      List<Idea> ideas = ideaRepo.findAll();
      List<User> users = userRepo.findAll();
      if (users.isEmpty())
         return;

      List<Comment> comments = new java.util.ArrayList<>();

      // Add 3-5 comments for each idea
      for (int i = 0; i < Math.min(ideas.size(), 30); i++) {
         Idea idea = ideas.get(i);
         int userCount = users.size();

         comments.add(createComment("Ý tưởng hay! Rất thực tế.", users.get(i % userCount), idea));
         comments.add(createComment("Bạn có thể expand thêm chi tiết về timeline không?",
               users.get((i + 1) % userCount), idea));
         comments.add(createComment("Team của tôi rất hỗ trợ idea này!", users.get((i + 2) % userCount), idea));

         if (i % 3 == 0) {
            comments.add(createComment("Cần POC trước khi implement toàn diện.", users.get((i + 3) % userCount), idea));
         }
         if (i % 4 == 0) {
            comments.add(
                  createComment("Quá tuyệt vời! Implement ngay từ quarter này.", users.get((i + 4) % userCount), idea));
         }
      }

      // Ensure we have a good number of comments
      if (comments.size() < 75) {
         // Add more random comments to other ideas
         for (int i = 0; i < ideas.size() && comments.size() < 120; i++) {
            Idea idea = ideas.get(i);
            int userCount = users.size();
            int numComments = (i % 5) + 2;

            for (int j = 0; j < numComments; j++) {
               String[] commentTexts = {
                     "Good point! Let's discuss più in detail.",
                     "Great innovation! +1",
                     "Needs more research and validation.",
                     "This could revolucionize our workflow.",
                     "Agree with this approach.",
                     "How about phase implementation?",
                     "Safety and security concerns?",
                     "Budget allocation required.",
                     "Timeline looks reasonable.",
                     "Team capacity available?",
                     "Customer feedback needed.",
                     "Competitor analysis done?",
                     "Technical feasibility confirmed?",
                     "Framework support required?",
                     "Training needed for staff?"
               };

               String comment = commentTexts[(i * comments.size() + j) % commentTexts.length];
               comments.add(createComment(comment, users.get((i + j) % userCount), idea));
            }
         }
      }

      commentRepo.saveAll(comments);
      System.out.println("Seeded " + comments.size() + " comments.");
   }

   private Comment createComment(String content, User user, Idea idea) {
      Comment comment = new Comment();
      comment.setContent(content);
      comment.setUser(user);
      comment.setIdea(idea);
      comment.setIsAnonymous(false);
      comment.setCreatedAt(LocalDateTime.now().minusHours((long) (Math.random() * 48)));
      comment.setUpdatedAt(LocalDateTime.now().minusHours((long) (Math.random() * 48)));
      return comment;
   }
}
