package com.example.comp1640.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.comp1640.dto.response.IdeaResponse;
import com.example.comp1640.dto.response.ReportStatsResponse;
import com.example.comp1640.model.Category;
import com.example.comp1640.model.Idea;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.repository.VoteRepository;
import com.example.comp1640.service.ReportService;

@Service
public class ReportServiceImpl implements ReportService {

    private final IdeaRepository ideaRepo;
    private final CommentRepository commentRepo;
    private final VoteRepository voteRepo;
    private final UserRepository userRepo;

    public ReportServiceImpl(IdeaRepository ideaRepo, CommentRepository commentRepo,
                              VoteRepository voteRepo, UserRepository userRepo) {
        this.ideaRepo = ideaRepo;
        this.commentRepo = commentRepo;
        this.voteRepo = voteRepo;
        this.userRepo = userRepo;
    }

    @Override
    public ReportStatsResponse getStats(Integer yearId, Integer deptId) {
        long totalIdeas        = ideaRepo.countFiltered(yearId, deptId);
        long totalComments     = commentRepo.countFiltered(yearId, deptId);
        long totalVotes        = voteRepo.countFiltered(yearId, deptId);
        long totalContributors = ideaRepo.countDistinctContributors(yearId, deptId);
        long anonymousIdeas    = ideaRepo.countAnonymous(yearId, deptId);
        double anonymousRate   = totalIdeas > 0 ? (double) anonymousIdeas / totalIdeas * 100 : 0.0;

        List<ReportStatsResponse.DeptStats> byDept = ideaRepo.countGroupByDept(yearId)
                .stream()
                .map(row -> new ReportStatsResponse.DeptStats(
                        row[0] != null ? (String) row[0] : "Không có phòng ban",
                        (Long) row[1]))
                .collect(Collectors.toList());

        List<ReportStatsResponse.CategoryStats> byCategory = ideaRepo.countGroupByCategory(yearId)
                .stream()
                .map(row -> new ReportStatsResponse.CategoryStats(
                        (String) row[0],
                        (Long) row[1]))
                .collect(Collectors.toList());

        return new ReportStatsResponse(
                totalIdeas, totalComments, totalVotes,
                totalContributors, anonymousIdeas, anonymousRate,
                byDept, byCategory
        );
    }

    @Override
    public List<IdeaResponse> getNoCommentIdeas(Integer yearId, Integer deptId) {
        User currentUser = getCurrentUserOptional().orElse(null);
        return ideaRepo.findNoComment(yearId, deptId)
                .stream()
                .map(i -> toResponse(i, currentUser))
                .collect(Collectors.toList());
    }

    // --- helpers ---

    private java.util.Optional<User> getCurrentUserOptional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return java.util.Optional.empty();
        }
        return userRepo.findByEmail(auth.getName());
    }

    private boolean canViewIdentity(User viewer) {
        if (viewer == null) return false;
        String role = viewer.getRole() != null ? viewer.getRole().getRoleName() : "";
        return role.equals("ADMIN") || role.equals("QA_MGR");
    }

    private IdeaResponse toResponse(Idea idea, User viewer) {
        boolean showIdentity = !Boolean.TRUE.equals(idea.getIsAnonymous()) || canViewIdentity(viewer);

        Set<String> categoryNames = idea.getCategories().stream()
                .map(Category::getCategoryName)
                .collect(Collectors.toSet());

        long upvotes   = voteRepo.countUpvotes(idea.getIdeaId());
        long downvotes = voteRepo.countDownvotes(idea.getIdeaId());

        return new IdeaResponse(
                idea.getIdeaId(),
                idea.getTitle(),
                idea.getContent(),
                showIdentity ? idea.getUser().getFullName() : "Ẩn danh",
                showIdentity ? idea.getUser().getUserId() : null,
                idea.getDepartment() != null ? idea.getDepartment().getDeptName() : null,
                idea.getAcademicYear().getYearLabel(),
                categoryNames,
                idea.getIsAnonymous(),
                idea.getIsDisabled(),
                idea.getViewCount(),
                upvotes,
                downvotes,
                idea.getTermsAccepted(),
                idea.getSubmittedAt(),
                idea.getUpdatedAt()
        );
    }
}
