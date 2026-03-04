package com.example.comp1640.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IdeaResponse {

    private Integer ideaId;
    private String title;
    private String content;

    // Ẩn danh: trả null nếu isAnonymous = true (trừ ADMIN/QA_MGR)
    private String authorName;
    private Integer authorId;

    private String departmentName;
    private String academicYearLabel;
    private Set<String> categories;

    private Boolean isAnonymous;
    private Boolean isDisabled;
    private Integer viewCount;
    private Boolean termsAccepted;

    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}
