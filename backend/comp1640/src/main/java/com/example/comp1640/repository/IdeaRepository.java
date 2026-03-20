package com.example.comp1640.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.comp1640.model.Idea;

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

    // --- Report queries ---

    @Query("SELECT COUNT(DISTINCT i.user) FROM Idea i WHERE (:yearId IS NULL OR i.academicYear.yearId = :yearId) AND (:deptId IS NULL OR i.department.deptId = :deptId)")
    long countDistinctContributors(@Param("yearId") Integer yearId, @Param("deptId") Integer deptId);

    @Query("SELECT COUNT(i) FROM Idea i WHERE i.isAnonymous = true AND (:yearId IS NULL OR i.academicYear.yearId = :yearId) AND (:deptId IS NULL OR i.department.deptId = :deptId)")
    long countAnonymous(@Param("yearId") Integer yearId, @Param("deptId") Integer deptId);

    @Query("SELECT COUNT(i) FROM Idea i WHERE (:yearId IS NULL OR i.academicYear.yearId = :yearId) AND (:deptId IS NULL OR i.department.deptId = :deptId)")
    long countFiltered(@Param("yearId") Integer yearId, @Param("deptId") Integer deptId);

    @Query("SELECT i.department.deptName, COUNT(i) FROM Idea i WHERE (:yearId IS NULL OR i.academicYear.yearId = :yearId) GROUP BY i.department.deptName")
    List<Object[]> countGroupByDept(@Param("yearId") Integer yearId);

    @Query("SELECT c.categoryName, COUNT(i) FROM Idea i JOIN i.categories c WHERE (:yearId IS NULL OR i.academicYear.yearId = :yearId) GROUP BY c.categoryName")
    List<Object[]> countGroupByCategory(@Param("yearId") Integer yearId);

    @Query("SELECT i FROM Idea i WHERE NOT EXISTS (SELECT c FROM Comment c WHERE c.idea = i) AND (:yearId IS NULL OR i.academicYear.yearId = :yearId) AND (:deptId IS NULL OR i.department.deptId = :deptId)")
    List<Idea> findNoComment(@Param("yearId") Integer yearId, @Param("deptId") Integer deptId);
}
