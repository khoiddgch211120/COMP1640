package com.example.comp1640.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.comp1640.model.Vote;
import com.example.comp1640.model.Vote.VoteType;

public interface VoteRepository extends JpaRepository<Vote, Integer> {

    Optional<Vote> findByIdea_IdeaIdAndUser_UserId(Integer ideaId, Integer userId);

    long countByIdea_IdeaIdAndVoteType(Integer ideaId, VoteType voteType);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.idea.ideaId = :ideaId AND v.voteType = 'UPVOTE'")
    long countUpvotes(@Param("ideaId") Integer ideaId);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.idea.ideaId = :ideaId AND v.voteType = 'DOWNVOTE'")
    long countDownvotes(@Param("ideaId") Integer ideaId);
}
