package com.example.comp1640.dto.response;

import com.example.comp1640.entity.Idea;
import java.time.LocalDateTime;

public record IdeaNoCommentResponse(Integer ideaId, String title, String deptName, LocalDateTime submittedAt) {
    public static IdeaNoCommentResponse from(Idea i) {
        return new IdeaNoCommentResponse(i.getIdeaId(), i.getTitle(),
                i.getDepartment() != null ? i.getDepartment().getDeptName() : null, i.getSubmittedAt());
    }
}
