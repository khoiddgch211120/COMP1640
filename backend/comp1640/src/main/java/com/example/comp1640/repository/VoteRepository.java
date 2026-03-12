package com.example.comp1640.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.comp1640.entity.Vote;
import com.example.comp1640.entity.Vote.VoteType;

public interface VoteRepository extends JpaRepository<Vote, Integer> {

    Optional<Vote> findByIdea_IdeaIdAndUser_UserId(Integer ideaId, Integer userId);

    long countByIdea_IdeaIdAndVoteType(Integer ideaId, VoteType voteType);

    default long countUpvotes(Integer ideaId) {
        return countByIdea_IdeaIdAndVoteType(ideaId, VoteType.UPVOTE);
    }

    default long countDownvotes(Integer ideaId) {
        return countByIdea_IdeaIdAndVoteType(ideaId, VoteType.DOWNVOTE);
    }
}
