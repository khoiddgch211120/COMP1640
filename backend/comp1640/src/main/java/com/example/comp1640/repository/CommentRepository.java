package com.example.comp1640.repository;

import com.example.comp1640.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByIdeaIdeaIdOrderByCreatedAtAsc(Integer ideaId);
    List<Comment> findTop20ByOrderByCreatedAtDesc();
}
