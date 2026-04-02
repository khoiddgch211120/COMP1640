package com.example.comp1640.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.comp1640.entity.TermsConditions;

public interface TermsConditionsRepository extends JpaRepository<TermsConditions, Integer> {

    Optional<TermsConditions> findTopByOrderByCreatedAtDesc();
}
