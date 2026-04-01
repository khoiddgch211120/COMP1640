package com.example.comp1640.repository;

import com.example.comp1640.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByIdeaIdeaIdOrderByCreatedAtAsc(Integer ideaId);
    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COUNT(c) FROM Comment c WHERE (:yearId IS NULL OR c.idea.academicYear.yearId = :yearId) AND (:deptId IS NULL OR c.idea.department.deptId = :deptId)")
    long countFiltered(@Param("yearId") Integer yearId, @Param("deptId") Integer deptId);
}
