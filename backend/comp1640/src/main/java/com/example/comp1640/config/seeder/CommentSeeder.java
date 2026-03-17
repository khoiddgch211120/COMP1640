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
import org.springframework.stereotype.Component;

@Component
public class CommentSeeder implements CommandLineRunner {

   @Autowired
   private CommentRepository commentRepo;

   @Autowired
   private IdeaRepository ideaRepo;

   @Autowired
   private UserRepository userRepo;

   @Override
   public void run(String... args) throws Exception {
      if (commentRepo.count() > 10 || ideaRepo.count() == 0) {
         System.out.println("Comments already seeded or no ideas.");
         return;
      }

      List<Idea> ideas = ideaRepo.findAll();
      List<User> users = userRepo.findAll();

      List<Comment> comments = List.of(
            createComment("Ý tưởng hay! Có thể implement ngay.", users.get(0), ideas.get(0)),
            createComment("Need more details on cost.", users.get(1), ideas.get(0)),
            createComment("Great suggestion! Support it.", users.get(2), ideas.get(0)),
            createComment("This could save time for lecturers.", users.get(3 % users.size()), ideas.get(0)),
            createComment("Good idea for Greenwich VN campus.", users.get(0), ideas.get(0)),
            createComment("How about integration with LMS?", users.get(1), ideas.get(1)),
            createComment("Approved by IT team.", users.get(2), ideas.get(1)),
            createComment("Need POC first.", users.get(0), ideas.get(1)),
            createComment("Excellent for student experience.", users.get(1), ideas.get(2)),
            createComment("Vote up!", users.get(2), ideas.get(2)),
            createComment("Should test with students.", users.get(3 % users.size()), ideas.get(2)),
            createComment("Perfect for research.", users.get(0), ideas.get(3)),
            createComment("Cost effective solution.", users.get(1), ideas.get(3)),
            createComment("Ready to implement.", users.get(2), ideas.get(3)),
            // doubled data - more comments
            createComment("Additional thought: security concerns?", users.get(4 % users.size()), ideas.get(0)),
            createComment("Love this idea for Computing school.", users.get(5 % users.size()), ideas.get(1)),
            createComment("Business school needs this.", users.get(0), ideas.get(2)),
            createComment("Health dept approves.", users.get(1), ideas.get(3)),
            createComment("More details please.", users.get(2), ideas.get(0)),
            createComment("Great for Vietnam campus!", users.get(3 % users.size()), ideas.get(1)),
            createComment("Implement ASAP.", users.get(4 % users.size()), ideas.get(2)),
            createComment("Team support.", users.get(5 % users.size()), ideas.get(3)));

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
