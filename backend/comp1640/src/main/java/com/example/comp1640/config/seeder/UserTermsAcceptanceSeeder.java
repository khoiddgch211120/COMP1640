package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.UserTermsAcceptance;
import com.example.comp1640.entity.TermsConditions;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.UserTermsAcceptanceRepository;
import java.util.List;
import java.util.stream.Collectors;
import com.example.comp1640.repository.TermsConditionsRepository;
import com.example.comp1640.repository.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(13)
public class UserTermsAcceptanceSeeder implements CommandLineRunner {

   @Autowired
   private UserTermsAcceptanceRepository acceptanceRepo;

   @Autowired
   private TermsConditionsRepository termsRepo;

   @Autowired
   private UserRepository userRepo;

   @Override
   public void run(String... args) throws Exception {
      if (acceptanceRepo.count() > 0) {
         System.out.println("UserTermsAcceptance already seeded.");
         return;
      }

      List<TermsConditions> termsList = termsRepo.findAll();
      List<User> users = userRepo.findAll();

      if (termsList.isEmpty() || users.isEmpty())
         return;

      TermsConditions latestTerms = termsList.get(termsList.size() - 1);

      List<UserTermsAcceptance> acceptances = new java.util.ArrayList<>();

      // All users accept latest terms (minimum requirement)
      for (User user : users) {
         acceptances.add(UserTermsAcceptance.builder()
               .user(user)
               .termsCondition(latestTerms)
               .build());
      }

      acceptanceRepo.saveAll(acceptances);
      System.out.println("Seeded " + acceptances.size() + " user terms acceptances.");
   }
}
