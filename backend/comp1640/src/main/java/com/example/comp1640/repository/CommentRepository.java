package com.comp1640.repository;

import com.comp1640.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByIdea_IdeaIdOrderByCreatedAtDesc(Integer ideaId);
    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);  // latest comments globally
    List<Comment> findByIsAnonymousTrue();                           // exception report
    long countByIdea_IdeaId(Integer ideaId);
}
