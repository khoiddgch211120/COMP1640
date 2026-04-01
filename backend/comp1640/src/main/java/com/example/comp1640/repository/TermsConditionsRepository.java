package com.example.comp1640.repository;

import com.example.comp1640.entity.TermsConditions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TermsConditionsRepository extends JpaRepository<TermsConditions, Integer> {

    // Lấy version cao nhất hiện tại
    @Query("SELECT t FROM TermsConditions t ORDER BY t.version DESC")
    Optional<TermsConditions> findTopByOrderByVersionDesc();

    // Lấy max version number (dùng để tính nextVersion)
    @Query("SELECT COALESCE(MAX(t.version), 0) FROM TermsConditions t")
    Integer findMaxVersion();
}