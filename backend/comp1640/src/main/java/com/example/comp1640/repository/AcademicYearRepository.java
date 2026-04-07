package com.example.comp1640.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.comp1640.entity.AcademicYear;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Integer> {

    boolean existsByYearLabel(String yearLabel);

    // Lấy năm học hiện tại (active) hoặc nearest upcoming year
    @Query("""
                SELECT a FROM AcademicYear a
                WHERE :today BETWEEN a.ideaClosureDate AND a.finalClosureDate
                ORDER BY a.ideaClosureDate DESC
                LIMIT 1
            """)
    Optional<AcademicYear> findCurrentActive(@Param("today") LocalDate today);

    // Lấy năm học gần nhất (newest) nếu không có active year
    @Query("SELECT a FROM AcademicYear a ORDER BY a.ideaClosureDate DESC LIMIT 1")
    Optional<AcademicYear> findLatest();
}
