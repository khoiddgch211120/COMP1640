package com.example.comp1640.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeaResponse {

    private Integer ideaId;
    private String title;
    private String content;
    private String authorName;
    private Integer authorId;
    private String department;
    private String yearLabel;
    private Set<String> categories;
    private Boolean isAnonymous;
    private Boolean isDisabled;
    private Integer viewCount;
    private long upvotes;
    private long downvotes;
    private Long commentCount;
    private Boolean termsAccepted;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}