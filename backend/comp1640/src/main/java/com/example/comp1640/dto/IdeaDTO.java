package com.example.comp1640.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeaDTO {
   private Integer ideaId;
   private Integer userId;
   private String authorName;
   private Integer departmentId;
   private String departmentName;
   private Integer yearId;
   private String yearLabel;
   private String title;
   private String content;
   private Boolean isAnonymous;
   private Boolean isDisabled;
   private Integer viewCount;
   private Boolean termsAccepted;
   private LocalDateTime submittedAt;
   private LocalDateTime updatedAt;
   private List<CategoryDTO> categories;
   private List<DocumentDTO> documents;
   private Integer voteCount;
}
