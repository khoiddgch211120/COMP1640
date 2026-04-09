package com.example.comp1640.dto.response;

import com.example.comp1640.enums.NotifType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEventDto {
   private Integer notificationId;
   private NotifType type;
   private String title;
   private String message;
   private Integer ideaId;
   private Integer ideaAuthorId;
   private String ideaTitle;
   private Integer commentId;
   private Integer commentAuthorId;
   private String commentAuthorName;
   private String commentContent;
   private LocalDateTime createdAt;
   private Boolean isRead;
}
