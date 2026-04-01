package com.example.comp1640.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AnonymousContentResponse {
   private String contentType; // "IDEA" or "COMMENT"
   private Integer contentId;
   private String contentPreview;
   private String authorRealName;
   private Boolean isAnonymous;
   private LocalDateTime createdAt;
}
