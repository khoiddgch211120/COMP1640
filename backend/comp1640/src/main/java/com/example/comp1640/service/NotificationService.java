package com.example.comp1640.service;

import com.example.comp1640.dto.response.NotificationEventDto;
import com.example.comp1640.enums.NotifType;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

   void notifyNewIdeaToCoordinators(Idea idea);

   void notifyCommentToIdeaAuthor(Comment comment);

   Page<NotificationEventDto> getNotifications(Integer userId, Pageable pageable);

   long getUnreadCount(Integer userId);

   void markAsRead(Integer logId, Integer userId);

   void markAllAsRead(Integer userId);
}
