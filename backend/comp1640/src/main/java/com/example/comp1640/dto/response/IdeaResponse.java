package com.example.comp1640.dto.response;

import com.example.comp1640.entity.Category;
import com.example.comp1640.entity.Idea;

import java.time.LocalDateTime;
import java.util.List;

public record IdeaResponse(
    Integer ideaId,
    String  title,
    String  content,
    String  authorName,    // null if anonymous
    String  deptName,
    String  yearLabel,
    Boolean isAnonymous,
    Boolean isDisabled,
    Integer viewCount,
    Integer voteScore,
    Integer myVote,        // +1, -1, or null
    List<String> categories,
    LocalDateTime submittedAt
) {
    public static IdeaResponse from(Idea idea, boolean showAuthor, Integer voteScore, Integer myVote) {
        return new IdeaResponse(
            idea.getIdeaId(),
            idea.getTitle(),
            idea.getContent(),
            showAuthor ? idea.getUser().getFullName() : null,
            idea.getDepartment().getDeptName(),
            idea.getAcademicYear().getYearLabel(),
            idea.getIsAnonymous(),
            idea.getIsDisabled(),
            idea.getViewCount(),
            voteScore,
            myVote,
            idea.getCategories().stream().map(Category::getCategoryName).toList(),
            idea.getSubmittedAt()
        );
    }
}
