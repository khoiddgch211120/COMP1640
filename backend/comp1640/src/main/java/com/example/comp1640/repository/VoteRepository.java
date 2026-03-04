package com.example.comp1640.repository;

import com.example.comp1640.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Integer> {
   List<Vote> findByIdea_IdeaId(Integer ideaId);

   Optional<Vote> findByUser_UserIdAndIdea_IdeaId(Integer userId, Integer ideaId);

   @Query("SELECT SUM(v.voteType) FROM Vote v WHERE v.idea.ideaId = :ideaId")
   Integer getSumVoteTypeByIdeaId(@Param("ideaId") Integer ideaId);
}
