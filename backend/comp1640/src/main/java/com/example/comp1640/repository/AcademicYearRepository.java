package com.example.comp1640.repository;

import com.example.comp1640.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Integer> {
    List<AcademicYear> findAllByOrderByYearIdDesc();
}

