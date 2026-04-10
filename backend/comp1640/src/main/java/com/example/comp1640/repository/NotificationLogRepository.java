package com.example.comp1640.repository;

import com.example.comp1640.entity.NotificationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Integer> {

   Page<NotificationLog> findByRecipient_UserIdOrderBySentAtDesc(Integer userId, Pageable pageable);

   long countByRecipient_UserIdAndIsReadFalse(Integer userId);

   java.util.List<NotificationLog> findByRecipient_UserIdAndIsReadFalse(Integer userId);

   @Modifying
   @Query("DELETE FROM NotificationLog n WHERE n.recipient.userId = :userId")
   void deleteByRecipientUserId(@Param("userId") Integer userId);

   @Modifying
   @Query("DELETE FROM NotificationLog n WHERE n.comment IS NOT NULL AND n.comment.user.userId = :userId")
   void deleteByCommentAuthorUserId(@Param("userId") Integer userId);

   @Modifying
   @Query("DELETE FROM NotificationLog n WHERE n.idea IS NOT NULL AND n.idea.user.userId = :userId")
   void deleteByIdeaAuthorUserId(@Param("userId") Integer userId);
}
