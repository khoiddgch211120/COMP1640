package com.example.comp1640.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.comp1640.entity.Idea;

public interface IdeaRepository extends JpaRepository<Idea, Integer> {

    // --- Phiên bản có phân trang (dùng cho public listing) ---

    Page<Idea> findByAcademicYear_YearId(Integer yearId, Pageable pageable);

    Page<Idea> findByDepartment_DeptId(Integer deptId, Pageable pageable);

    Page<Idea> findByAcademicYear_YearIdAndDepartment_DeptId(Integer yearId, Integer deptId, Pageable pageable);

    // Ý tưởng mới nhất (submitted_at DESC)
    @Query("SELECT i FROM Idea i ORDER BY i.submittedAt DESC")
    Page<Idea> findLatest(Pageable pageable);

    // Ý tưởng phổ biến nhất theo số upvote
    @Query("SELECT i FROM Idea i ORDER BY (SELECT COUNT(v) FROM Vote v WHERE v.idea = i AND v.voteType = 'UPVOTE') DESC")
    Page<Idea> findMostPopular(Pageable pageable);

    // Most viewed theo năm học (không phân trang, dùng cho specific yearId)
    @Query("SELECT i FROM Idea i WHERE i.academicYear.yearId = :yearId ORDER BY i.viewCount DESC")
    List<Idea> findMostViewed(@Param("yearId") Integer yearId);

    // --- Phiên bản không phân trang (giữ cho tương thích với Report/Export) ---

    List<Idea> findByAcademicYear_YearId(Integer yearId);

    List<Idea> findByDepartment_DeptId(Integer deptId);

    List<Idea> findByUser_UserId(Integer userId);

    List<Idea> findByAcademicYear_YearIdAndDepartment_DeptId(Integer yearId, Integer deptId);

    // Ideas without any comments
    @Query("SELECT i FROM Idea i WHERE i.academicYear.yearId = :yearId AND i NOT IN (" +
            "SELECT DISTINCT c.idea FROM Comment c)")
    List<Idea> findIdeasWithoutComments(@Param("yearId") Integer yearId);

    // Ideas without any comments (all years)
    @Query("SELECT i FROM Idea i WHERE i NOT IN (" +
            "SELECT DISTINCT c.idea FROM Comment c)")
    List<Idea> findAllIdeasWithoutComments();

    // Ideas with anonymous flag = true
    @Query("SELECT i FROM Idea i WHERE i.academicYear.yearId = :yearId AND i.isAnonymous = true")
    List<Idea> findAnonymousIdeas(@Param("yearId") Integer yearId);

    // Ideas with anonymous flag = true (all years)
    @Query("SELECT i FROM Idea i WHERE i.isAnonymous = true")
    List<Idea> findAllAnonymousIdeas();
}
