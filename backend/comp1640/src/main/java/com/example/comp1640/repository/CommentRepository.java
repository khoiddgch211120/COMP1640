package com.example.comp1640.repository;

import com.example.comp1640.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findByIdeaIdeaIdOrderByCreatedAtDesc(Integer ideaId);

    // Dùng trong DashboardServiceImpl để đếm comments theo idea
    long countByIdeaIdeaId(Integer ideaId);

    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);
}