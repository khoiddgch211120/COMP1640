package com.example.comp1640.repository;

import com.example.comp1640.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findByIdeaIdeaIdOrderByCreatedAtDesc(Integer ideaId);

    List<Comment> findByIdeaIdeaIdOrderByCreatedAtAsc(Integer ideaId);

    // Dùng trong DashboardServiceImpl để đếm comments theo idea
    long countByIdeaIdeaId(Integer ideaId);

    // Truy vấn 1 lần tất cả ideaId có ít nhất 1 comment (tránh N+1)
    @Query("SELECT DISTINCT c.idea.ideaId FROM Comment c")
    java.util.Set<Integer> findDistinctIdeaIdsWithComments();

    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.idea.academicYear.yearId = :yearId AND c.isAnonymous = true")
    List<Comment> findAnonymousCommentsByYear(@Param("yearId") Integer yearId);

    // Anonymous comments (all years)
    @Query("SELECT c FROM Comment c WHERE c.isAnonymous = true")
    List<Comment> findAllAnonymousComments();

    @Query("SELECT c FROM Comment c WHERE c.idea.academicYear.yearId = :yearId")
    List<Comment> findByIdea_AcademicYear_YearId(@Param("yearId") Integer yearId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.user.userId = :userId")
    void deleteByUserUserId(@Param("userId") Integer userId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.idea.user.userId = :userId")
    void deleteByIdeaAuthorUserId(@Param("userId") Integer userId);
}