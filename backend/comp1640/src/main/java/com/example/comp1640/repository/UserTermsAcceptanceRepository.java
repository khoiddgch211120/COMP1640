package com.example.comp1640.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.comp1640.model.UserTermsAcceptance;
import com.example.comp1640.model.UserTermsAcceptanceId;

public interface UserTermsAcceptanceRepository extends JpaRepository<UserTermsAcceptance, UserTermsAcceptanceId> {

    boolean existsByUser_UserIdAndTermsConditions_TermsId(Integer userId, Integer termsId);
}
