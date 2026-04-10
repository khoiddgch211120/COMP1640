package com.example.comp1640.service.impl;

import com.example.comp1640.service.NotificationService;
import com.example.comp1640.dto.response.NotificationEventDto;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.NotificationLog;
import com.example.comp1640.entity.User;
import com.example.comp1640.entity.Department;
import com.example.comp1640.enums.NotifType;
import com.example.comp1640.enums.NotifStatus;
import com.example.comp1640.enums.RoleName;
import com.example.comp1640.repository.NotificationLogRepository;
import com.example.comp1640.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

      private final SimpMessagingTemplate messagingTemplate;
      private final UserRepository userRepository;
      private final NotificationLogRepository notificationLogRepository;

      @Override
      @Transactional
      public void notifyNewIdeaToCoordinators(Idea idea) {
            if (idea == null || idea.getDepartment() == null) {
                  return;
            }

            Department department = idea.getDepartment();
            List<User> coordinators = userRepository.findByDepartment_DeptIdAndRole_RoleName(
                        department.getDeptId(),
                        RoleName.QA_COORDINATOR);

            String ideaTitle = idea.getTitle();
            String authorName = idea.getIsAnonymous()
                        ? "Ẩn danh"
                        : (idea.getUser() != null ? idea.getUser().getFullName() : "Unknown");

            String title = "Ý tưởng mới được nộp";
            String message = String.format("Ý tưởng \"%s\" từ %s", ideaTitle, authorName);

            for (User coordinator : coordinators) {
                  // Lưu vào database
                  NotificationLog notifLog = NotificationLog.builder()
                              .recipient(coordinator)
                              .idea(idea)
                              .notifType(NotifType.NEW_IDEA)
                              .title(title)
                              .message(message)
                              .isRead(false)
                              .status(NotifStatus.SENT)
                              .build();
                  notifLog = notificationLogRepository.save(notifLog);

                  // Build DTO với logId từ database
                  NotificationEventDto notification = NotificationEventDto.builder()
                              .notificationId(notifLog.getLogId())
                              .type(NotifType.NEW_IDEA)
                              .title(title)
                              .message(message)
                              .ideaId(idea.getIdeaId())
                              .ideaAuthorId(idea.getUser() != null ? idea.getUser().getUserId() : null)
                              .ideaTitle(ideaTitle)
                              .createdAt(notifLog.getSentAt() != null ? notifLog.getSentAt() : LocalDateTime.now())
                              .isRead(false)
                              .build();

                  // Gửi qua WebSocket
                  messagingTemplate.convertAndSendToUser(
                              coordinator.getUserId().toString(),
                              "/queue/notifications",
                              notification);
                  log.info("Notification saved & sent to coordinator: {} (ID: {})", coordinator.getFullName(),
                              coordinator.getUserId());
            }
      }

      @Override
      @Transactional
      public void notifyCommentToIdeaAuthor(Comment comment) {
            if (comment == null || comment.getIdea() == null || comment.getIdea().getUser() == null) {
                  return;
            }

            Idea idea = comment.getIdea();
            User ideaAuthor = idea.getUser();
            User commentAuthor = comment.getUser();

            if (ideaAuthor.getUserId().equals(commentAuthor.getUserId())) {
                  return;
            }

            String authorName = comment.getIsAnonymous()
                        ? "Ẩn danh"
                        : (commentAuthor != null ? commentAuthor.getFullName() : "Unknown");

            String title = "Bình luận mới trên ý tưởng của bạn";
            String message = String.format("%s đã bình luận trên \"%s\"", authorName, idea.getTitle());

            // Lưu vào database
            NotificationLog notifLog = NotificationLog.builder()
                        .recipient(ideaAuthor)
                        .idea(idea)
                        .comment(comment)
                        .notifType(NotifType.NEW_COMMENT)
                        .title(title)
                        .message(message)
                        .isRead(false)
                        .status(NotifStatus.SENT)
                        .build();
            notifLog = notificationLogRepository.save(notifLog);

            // Build DTO với logId từ database
            NotificationEventDto notification = NotificationEventDto.builder()
                        .notificationId(notifLog.getLogId())
                        .type(NotifType.NEW_COMMENT)
                        .title(title)
                        .message(message)
                        .ideaId(idea.getIdeaId())
                        .ideaTitle(idea.getTitle())
                        .commentId(comment.getCommentId())
                        .commentAuthorId(commentAuthor != null ? commentAuthor.getUserId() : null)
                        .commentAuthorName(authorName)
                        .commentContent(comment.getContent())
                        .createdAt(notifLog.getSentAt() != null ? notifLog.getSentAt() : LocalDateTime.now())
                        .isRead(false)
                        .build();

            messagingTemplate.convertAndSendToUser(
                        ideaAuthor.getUserId().toString(),
                        "/queue/notifications",
                        notification);
            log.info("Notification saved & sent to idea author: {} via STOMP", ideaAuthor.getFullName());
      }

      @Override
      public Page<NotificationEventDto> getNotifications(Integer userId, Pageable pageable) {
            Page<NotificationLog> logs = notificationLogRepository.findByRecipient_UserIdOrderBySentAtDesc(userId,
                        pageable);
            return logs.map(this::toDto);
      }

      @Override
      public long getUnreadCount(Integer userId) {
            return notificationLogRepository.countByRecipient_UserIdAndIsReadFalse(userId);
      }

      @Override
      @Transactional
      public void markAsRead(Integer logId, Integer userId) {
            NotificationLog notif = notificationLogRepository.findById(logId)
                        .orElseThrow(() -> new RuntimeException("Notification not found"));
            if (!notif.getRecipient().getUserId().equals(userId)) {
                  throw new RuntimeException("Unauthorized");
            }
            notif.setIsRead(true);
            notificationLogRepository.save(notif);
      }

      @Override
      @Transactional
      public void markAllAsRead(Integer userId) {
            List<NotificationLog> unread = notificationLogRepository.findByRecipient_UserIdAndIsReadFalse(userId);
            unread.forEach(n -> n.setIsRead(true));
            notificationLogRepository.saveAll(unread);
      }

      private NotificationEventDto toDto(NotificationLog log) {
            NotificationEventDto.NotificationEventDtoBuilder builder = NotificationEventDto.builder()
                        .notificationId(log.getLogId())
                        .type(log.getNotifType())
                        .title(log.getTitle())
                        .message(log.getMessage())
                        .isRead(log.getIsRead())
                        .createdAt(log.getSentAt());

            if (log.getIdea() != null) {
                  builder.ideaId(log.getIdea().getIdeaId());
                  builder.ideaTitle(log.getIdea().getTitle());
            }
            if (log.getComment() != null) {
                  builder.commentId(log.getComment().getCommentId());
            }
            return builder.build();
      }
}
