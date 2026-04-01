package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Vote;
import com.example.comp1640.entity.Vote.VoteType;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.VoteRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class VoteSeeder implements CommandLineRunner {

   @Autowired
   private VoteRepository voteRepo;

   @Autowired
   private IdeaRepository ideaRepo;

   @Autowired
   private UserRepository userRepo;

   @Override
   public void run(String... args) throws Exception {
      if (voteRepo.count() > 0 || ideaRepo.count() == 0) {
         System.out.println("Votes already seeded.");
         return;
      }

      List<Idea> ideas = ideaRepo.findAll();
      List<User> users = userRepo.findAll();
      if (users.isEmpty())
         return;

      List<Vote> votes = new java.util.ArrayList<>();

      // Add 5-10 up/down votes for each idea
      for (int i = 0; i < ideas.size(); i++) {
         Idea idea = ideas.get(i);
         int userCount = users.size();

         // Add mix of upvotes and downvotes
         int numVotes = 5 + (i % 6); // 5-10 votes per idea
         int upvotes = (int) (numVotes * 0.7); // 70% upvotes
         int downvotes = numVotes - upvotes; // 30% downvotes

         // Add upvotes
         for (int j = 0; j < upvotes; j++) {
            votes.add(createVote(VoteType.UPVOTE, users.get((i * 7 + j) % userCount), idea));
         }

         // Add downvotes
         for (int j = 0; j < downvotes; j++) {
            votes.add(createVote(VoteType.DOWNVOTE, users.get((i * 11 + upvotes + j) % userCount), idea));
         }
      }

      voteRepo.saveAll(votes);
      System.out.println("Seeded " + votes.size() + " votes.");
   }

   private Vote createVote(VoteType type, User user, Idea idea) {
      Vote vote = new Vote();
      vote.setVoteType(type);
      vote.setUser(user);
      vote.setIdea(idea);
      vote.setCreatedAt(LocalDateTime.now());
      return vote;
   }
}
