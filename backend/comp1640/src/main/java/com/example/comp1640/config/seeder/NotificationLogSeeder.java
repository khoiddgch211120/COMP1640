package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.NotificationLog;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.User;
import com.example.comp1640.enums.NotifStatus;
import com.example.comp1640.enums.NotifType;
import com.example.comp1640.repository.NotificationLogRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class NotificationLogSeeder implements CommandLineRunner {

   @Autowired
   private NotificationLogRepository logRepo; // add if not exists

   @Autowired
   private IdeaRepository ideaRepo;

   @Autowired
   private UserRepository userRepo;

   @Override
   public void run(String... args) throws Exception {
      if (logRepo.count() > 0 || ideaRepo.count() == 0) {
         System.out.println("NotificationLogs already seeded.");
         return;
      }

      List<Idea> ideas = ideaRepo.findAll();
      List<User> users = userRepo.findAll();
      if (users.isEmpty())
         return;

      java.util.List<NotificationLog> logs = new java.util.ArrayList<>();

      // Add notifications for ideas and comments
      for (int i = 0; i < ideas.size(); i++) {
         Idea idea = ideas.get(i);

         // Notify random users about new ideas
         int numNotifs = (i % 5) + 2; // 2-6 notifications per idea
         for (int j = 0; j < numNotifs && j < users.size(); j++) {
            User recipient = users.get((i * 7 + j) % users.size());
            if (!recipient.getUserId().equals(idea.getUser().getUserId())) { // Don't notify submitter
               logs.add(NotificationLog.builder()
                     .recipient(recipient)
                     .idea(idea)
                     .notifType(i % 2 == 0 ? NotifType.NEW_IDEA : NotifType.NEW_COMMENT)
                     .status(NotifStatus.SENT)
                     .sentAt(java.time.LocalDateTime.now())
                     .build());
            }
         }
      }

      // Add more notification types
      for (int i = 0; i < Math.min(ideas.size(), 20); i++) {
         Idea idea = ideas.get(i);
         User randomUser = users.get(i % users.size());

         if (i % 3 == 0) {
            logs.add(NotificationLog.builder()
                  .recipient(randomUser)
                  .idea(idea)
                  .notifType(NotifType.NEW_COMMENT)
                  .status(NotifStatus.SENT)
                  .sentAt(java.time.LocalDateTime.now())
                  .build());
         }
         if (i % 4 == 0) {
            logs.add(NotificationLog.builder()
                  .recipient(randomUser)
                  .idea(idea)
                  .notifType(NotifType.NEW_IDEA)
                  .status(NotifStatus.SENT)
                  .sentAt(java.time.LocalDateTime.now())
                  .build());
         }
         if (i % 5 == 0) {
            logs.add(NotificationLog.builder()
                  .recipient(randomUser)
                  .idea(idea)
                  .notifType(NotifType.NEW_COMMENT)
                  .status(NotifStatus.SENT)
                  .sentAt(java.time.LocalDateTime.now())
                  .build());
         }
      }

      logRepo.saveAll(logs);
      System.out.println("Seeded " + logs.size() + " notification logs.");
   }
}
