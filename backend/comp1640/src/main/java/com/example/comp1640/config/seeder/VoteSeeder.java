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

      List<Vote> votes = List.of(
            createVote(VoteType.UPVOTE, users.get(0), ideas.get(0)),
            createVote(VoteType.DOWNVOTE, users.get(1), ideas.get(0)),
            createVote(VoteType.UPVOTE, users.get(2), ideas.get(0)),
            createVote(VoteType.UPVOTE, users.get(0), ideas.get(1)),
            createVote(VoteType.DOWNVOTE, users.get(1), ideas.get(1)),
            createVote(VoteType.UPVOTE, users.get(2), ideas.get(1)),
            createVote(VoteType.UPVOTE, users.get(0), ideas.get(2)),
            createVote(VoteType.DOWNVOTE, users.get(1), ideas.get(2)),
            createVote(VoteType.UPVOTE, users.get(3 % users.size()), ideas.get(0)),
            createVote(VoteType.DOWNVOTE, users.get(4 % users.size()), ideas.get(1)),
            createVote(VoteType.UPVOTE, users.get(5 % users.size()), ideas.get(2)),
            createVote(VoteType.UPVOTE, users.get(0), ideas.get(3)),
            createVote(VoteType.DOWNVOTE, users.get(1), ideas.get(3))
      // more for double data
      );

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
