package com.example.comp1640.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.comp1640.entity.NotificationLog;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Integer> {

    List<NotificationLog> findByRecipient_UserIdOrderBySentAtDesc(Integer userId);
}
