package com.example.comp1640.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.comp1640.entity.AcademicYear;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Integer> {

    boolean existsByYearLabel(String yearLabel);

    // Lấy năm học hiện tại: hôm nay nằm trong khoảng trước final_closure_date
    @Query("SELECT a FROM AcademicYear a WHERE :today <= a.finalClosureDate ORDER BY a.ideaClosureDate DESC")
    Optional<AcademicYear> findCurrent(@Param("today") LocalDate today);
}
