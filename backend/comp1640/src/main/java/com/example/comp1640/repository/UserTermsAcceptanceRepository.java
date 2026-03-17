package com.example.comp1640.repository;

import com.example.comp1640.entity.UserTermsAcceptance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTermsAcceptanceRepository extends JpaRepository<UserTermsAcceptance, UserTermsAcceptance.UserTermsId> {
}

