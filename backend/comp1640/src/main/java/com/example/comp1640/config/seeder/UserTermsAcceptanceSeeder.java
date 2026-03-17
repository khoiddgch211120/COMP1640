package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.UserTermsAcceptance;
import com.example.comp1640.entity.TermsCondition;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.UserTermsAcceptanceRepository;
import java.util.List;
import java.util.stream.Collectors;
import com.example.comp1640.repository.TermsConditionRepository;
import com.example.comp1640.repository.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UserTermsAcceptanceSeeder implements CommandLineRunner {

   @Autowired
   private UserTermsAcceptanceRepository acceptanceRepo;

   @Autowired
   private TermsConditionRepository termsRepo;

   @Autowired
   private UserRepository userRepo;

   @Override
   public void run(String... args) throws Exception {
      if (acceptanceRepo.count() > 0) {
         System.out.println("UserTermsAcceptance already seeded.");
         return;
      }

      List<TermsCondition> termsList = termsRepo.findAll();
      List<User> users = userRepo.findAll();

      if (termsList.isEmpty() || users.isEmpty())
         return;

      TermsCondition terms1 = termsList.get(0);

      acceptanceRepo.saveAll(List.of(
            UserTermsAcceptance.builder()
                  .user(users.get(0))
                  .termsCondition(terms1)
                  .build(),
            UserTermsAcceptance.builder()
                  .user(users.get(1))
                  .termsCondition(terms1)
                  .build()
      // all users accept latest terms
      ));

      System.out.println("Seeded user terms acceptances.");
   }
}
