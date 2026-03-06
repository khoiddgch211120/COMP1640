package com.comp1640.service.impl;

import com.comp1640.dto.request.CommentRequest;
import com.comp1640.dto.response.CommentResponse;
import com.comp1640.entity.*;
import com.comp1640.exception.BadRequestException;
import com.comp1640.exception.ResourceNotFoundException;
import com.comp1640.repository.*;
import com.comp1640.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository      commentRepository;
    private final IdeaService            ideaService;
    private final UserRepository         userRepository;
    private final AcademicYearRepository yearRepository;
    private final NotificationService    notificationService;

    public List<CommentResponse> getByIdeaId(Integer ideaId) {
        return commentRepository.findByIdea_IdeaIdOrderByCreatedAtDesc(ideaId)
                .stream().map(CommentResponse::from).toList();
    }

    public Page<CommentResponse> getLatest(int page, int size) {
        return commentRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(CommentResponse::from);
    }

    @Transactional
    public CommentResponse create(Integer ideaId, CommentRequest req) {
        Idea idea = ideaService.findIdea(ideaId);

        // Check final closure date
        AcademicYear year = idea.getAcademicYear();
        if (LocalDate.now().isAfter(year.getFinalClosureDate()))
            throw new BadRequestException("Comments are closed for this academic year");

        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = Comment.builder()
                .idea(idea)
                .user(user)
                .content(req.content())
                .isAnonymous(req.isAnonymous() != null ? req.isAnonymous() : false)
                .build();

        Comment saved = commentRepository.save(comment);

        // Async email to idea author
        notificationService.sendNewCommentNotification(idea, saved);

        return CommentResponse.from(saved);
    }
}
