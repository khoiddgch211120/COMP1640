package com.example.comp1640.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.comp1640.model.Idea;

public interface IdeaRepository extends JpaRepository<Idea, Integer> {

    // Lấy tất cả idea theo năm học
    List<Idea> findByAcademicYear_YearId(Integer yearId);

    // Lấy idea theo phòng ban
    List<Idea> findByDepartment_DeptId(Integer deptId);

    // Lấy idea của một user
    List<Idea> findByUser_UserId(Integer userId);

    // Lấy idea theo năm học + phòng ban
    List<Idea> findByAcademicYear_YearIdAndDepartment_DeptId(Integer yearId, Integer deptId);

    // Most popular: sắp xếp theo view_count
    @Query("SELECT i FROM Idea i WHERE i.academicYear.yearId = :yearId ORDER BY i.viewCount DESC")
    List<Idea> findMostViewed(@Param("yearId") Integer yearId);
}
