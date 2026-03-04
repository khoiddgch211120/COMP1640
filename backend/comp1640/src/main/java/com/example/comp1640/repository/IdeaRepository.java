package com.example.comp1640.repository;

import com.example.comp1640.entity.Idea;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IdeaRepository extends JpaRepository<Idea, Integer> {
    Page<Idea> findAllByOrderBySubmittedAtDesc(Pageable pageable);
    
    Optional<Idea> findByIdeaId(Integer ideaId);
    
    @Query("SELECT i FROM Idea i ORDER BY i.viewCount DESC")
    List<Idea> findTopByViewCount(Pageable pageable);
    
    @Query("SELECT i FROM Idea i ORDER BY i.submittedAt DESC")
    List<Idea> findLatest(Pageable pageable);
    
    @Query("SELECT i FROM Idea i LEFT JOIN Vote v ON i = v.idea GROUP BY i ORDER BY SUM(v.voteType) DESC")
    List<Idea> findMostPopular(Pageable pageable);
    
    List<Idea> findByUser_UserId(Integer userId);
    
    @Query("SELECT i FROM Idea i WHERE i.academicYear.yearId = :yearId")
    List<Idea> findByAcademicYear_YearId(@Param("yearId") Integer yearId);
}

