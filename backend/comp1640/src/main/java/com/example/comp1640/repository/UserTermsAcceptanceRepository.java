package com.example.comp1640.repository;

import com.example.comp1640.entity.UserTermsAcceptance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTermsAcceptanceRepository
      extends JpaRepository<UserTermsAcceptance, UserTermsAcceptance.UserTermsId> {

   @Modifying
   @Query("DELETE FROM UserTermsAcceptance u WHERE u.user.userId = :userId")
   void deleteByUserUserId(@Param("userId") Integer userId);
}
