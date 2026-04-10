package com.example.comp1640.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.comp1640.entity.Vote;
import com.example.comp1640.entity.Vote.VoteType;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoteRepository extends JpaRepository<Vote, Integer> {

    Optional<Vote> findByIdea_IdeaIdAndUser_UserId(Integer ideaId, Integer userId);

    long countByIdea_IdeaIdAndVoteType(Integer ideaId, VoteType voteType);

    default long countUpvotes(Integer ideaId) {
        return countByIdea_IdeaIdAndVoteType(ideaId, VoteType.UPVOTE);
    }

    default long countDownvotes(Integer ideaId) {
        return countByIdea_IdeaIdAndVoteType(ideaId, VoteType.DOWNVOTE);
    }

    @Modifying
    @Query("DELETE FROM Vote v WHERE v.user.userId = :userId")
    void deleteByUserUserId(@Param("userId") Integer userId);

    @Modifying
    @Query("DELETE FROM Vote v WHERE v.idea.user.userId = :userId")
    void deleteByIdeaAuthorUserId(@Param("userId") Integer userId);
}
