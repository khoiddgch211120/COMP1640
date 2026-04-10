package com.example.comp1640.controller;

import com.example.comp1640.dto.response.NotificationEventDto;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

   private final NotificationService notificationService;
   private final UserRepository userRepository;

   @GetMapping
   public ResponseEntity<Page<NotificationEventDto>> getNotifications(
         @RequestParam(defaultValue = "0") int page,
         @RequestParam(defaultValue = "20") int size) {
      Integer userId = getCurrentUserId();
      Pageable pageable = PageRequest.of(page, size);
      return ResponseEntity.ok(notificationService.getNotifications(userId, pageable));
   }

   @GetMapping("/unread-count")
   public ResponseEntity<Map<String, Long>> getUnreadCount() {
      Integer userId = getCurrentUserId();
      long count = notificationService.getUnreadCount(userId);
      return ResponseEntity.ok(Map.of("unread_count", count));
   }

   @PatchMapping("/{id}/read")
   public ResponseEntity<Void> markAsRead(@PathVariable Integer id) {
      Integer userId = getCurrentUserId();
      notificationService.markAsRead(id, userId);
      return ResponseEntity.ok().build();
   }

   @PatchMapping("/read-all")
   public ResponseEntity<Void> markAllAsRead() {
      Integer userId = getCurrentUserId();
      notificationService.markAllAsRead(userId);
      return ResponseEntity.ok().build();
   }

   private Integer getCurrentUserId() {
      String email = SecurityContextHolder.getContext().getAuthentication().getName();
      User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
      return user.getUserId();
   }
}
