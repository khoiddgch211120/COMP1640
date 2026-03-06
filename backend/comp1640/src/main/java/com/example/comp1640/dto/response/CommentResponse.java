package com.example.comp1640.dto.response;

import com.example.comp1640.entity.Comment;
import java.time.LocalDateTime;

public record CommentResponse(
    Integer commentId, Integer ideaId,
    String  authorName, Boolean isAnonymous,
    String  content, LocalDateTime createdAt
) {
    public static CommentResponse from(Comment c) {
        return new CommentResponse(
            c.getCommentId(),
            c.getIdea().getIdeaId(),
            c.getIsAnonymous() ? null : c.getUser().getFullName(),
            c.getIsAnonymous(),
            c.getContent(),
            c.getCreatedAt()
        );
    }
}
