package com.example.comp1640.service.impl;

import com.example.comp1640.service.NotificationService;
import com.example.comp1640.dto.response.NotificationEventDto;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.User;
import com.example.comp1640.entity.Department;
import com.example.comp1640.enums.NotifType;
import com.example.comp1640.enums.RoleName;
import com.example.comp1640.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

   private final SimpMessagingTemplate messagingTemplate;
   private final UserRepository userRepository;

   @Override
   public void notifyNewIdeaToCoordinators(Idea idea) {
      if (idea == null || idea.getDepartment() == null) {
         return;
      }

      // Lấy tất cả QA Coordinators của phòng ban
      Department department = idea.getDepartment();
      List<User> coordinators = userRepository.findByDepartment_DeptIdAndRole_RoleName(
            department.getDeptId(),
            RoleName.QA_COORDINATOR);

      String ideaTitle = idea.getTitle();
      String authorName = idea.getIsAnonymous()
            ? "Ẩn danh"
            : (idea.getUser() != null ? idea.getUser().getFullName() : "Unknown");

      NotificationEventDto notification = NotificationEventDto.builder()
            .type(NotifType.NEW_IDEA)
            .title("Ý tưởng mới được nộp")
            .message(String.format("Ý tưởng \"%s\" từ %s", ideaTitle, authorName))
            .ideaId(idea.getIdeaId())
            .ideaAuthorId(idea.getUser() != null ? idea.getUser().getUserId() : null)
            .ideaTitle(ideaTitle)
            .createdAt(LocalDateTime.now())
            .isRead(false)
            .build();

      // Gửi notification qua WebSocket + STOMP tới từng coordinator
      for (User coordinator : coordinators) {
         String destination = "/user/" + coordinator.getUserId() + "/queue/notifications";
         messagingTemplate.convertAndSendToUser(
               coordinator.getUserId().toString(),
               "/queue/notifications",
               notification);
         log.info("Notification sent to coordinator: {} via STOMP", coordinator.getFullName());
      }
   }

   @Override
   public void notifyCommentToIdeaAuthor(Comment comment) {
      if (comment == null || comment.getIdea() == null || comment.getIdea().getUser() == null) {
         return;
      }

      Idea idea = comment.getIdea();
      User ideaAuthor = idea.getUser();
      User commentAuthor = comment.getUser();

      // Không gửi thông báo nếu tác giả bình luận chính là tác giả ý tưởng
      if (ideaAuthor.getUserId().equals(commentAuthor.getUserId())) {
         return;
      }

      String authorName = comment.getIsAnonymous()
            ? "Ẩn danh"
            : (commentAuthor != null ? commentAuthor.getFullName() : "Unknown");

      NotificationEventDto notification = NotificationEventDto.builder()
            .type(NotifType.NEW_COMMENT)
            .title("Bình luận mới trên ý tưởng của bạn")
            .message(String.format("%s đã bình luận trên \"%s\"", authorName, idea.getTitle()))
            .ideaId(idea.getIdeaId())
            .ideaTitle(idea.getTitle())
            .commentId(comment.getCommentId())
            .commentAuthorId(commentAuthor != null ? commentAuthor.getUserId() : null)
            .commentAuthorName(authorName)
            .commentContent(comment.getContent())
            .createdAt(LocalDateTime.now())
            .isRead(false)
            .build();

      // Gửi notification qua WebSocket + STOMP tới tác giả ý tưởng
      messagingTemplate.convertAndSendToUser(
            ideaAuthor.getUserId().toString(),
            "/queue/notifications",
            notification);
      log.info("Notification sent to idea author: {} via STOMP", ideaAuthor.getFullName());
   }
}
