package com.example.comp1640.repository;

import com.example.comp1640.entity.TermsCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TermsConditionRepository extends JpaRepository<TermsCondition, Integer> {
}

