package com.example.comp1640.repository;

import com.example.comp1640.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByIdeaIdeaIdOrderByCreatedAtAsc(Integer ideaId);

    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Find anonymous comments in a specific academic year
    @Query("SELECT c FROM Comment c WHERE c.isAnonymous = true AND c.idea.academicYear.yearId = :yearId")
    List<Comment> findAnonymousCommentsByYear(@Param("yearId") Integer yearId);
}
