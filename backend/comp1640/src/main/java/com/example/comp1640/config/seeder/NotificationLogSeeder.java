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

      logRepo.saveAll(List.of(
            NotificationLog.builder()
                  .recipient(users.get(1))
                  .idea(ideas.get(0))
                  .notifType(NotifType.NEW_IDEA)
                  .status(NotifStatus.SENT)
                  .build(),
            NotificationLog.builder()
                  .recipient(users.get(2))
                  .idea(ideas.get(1))
                  .notifType(NotifType.NEW_COMMENT)
                  .status(NotifStatus.SENT)

                  .build()
      // add more
      ));

      System.out.println("Seeded notification logs.");
   }
}
