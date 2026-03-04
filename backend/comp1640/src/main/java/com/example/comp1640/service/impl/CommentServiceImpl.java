package com.example.comp1640.service.impl;

import com.example.comp1640.dto.request.CommentRequest;
import com.example.comp1640.dto.response.CommentResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.model.Comment;
import com.example.comp1640.model.Idea;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;

    @Override
    public CommentResponse add(Integer ideaId, CommentRequest request) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ý tưởng với id: " + ideaId));

        // Chỉ được bình luận trước hoặc đúng ngày final_closure_date
        LocalDate today = LocalDate.now();
        if (today.isAfter(idea.getAcademicYear().getFinalClosureDate())) {
            throw new BadRequestException("Đã hết hạn bình luận cho ý tưởng này");
        }

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new BadRequestException("Nội dung bình luận không được để trống");
        }

        User currentUser = getCurrentUser();

        Comment comment = new Comment();
        comment.setIdea(idea);
        comment.setUser(currentUser);
        comment.setContent(request.getContent());
        comment.setIsAnonymous(request.getIsAnonymous() != null && request.getIsAnonymous());
        comment.setCreatedAt(LocalDateTime.now());

        return toResponse(commentRepository.save(comment), currentUser);
    }

    @Override
    public List<CommentResponse> getByIdea(Integer ideaId) {
        User currentUser = getCurrentUser();
        return commentRepository.findByIdeaIdeaIdOrderByCreatedAtAsc(ideaId)
                .stream().map(c -> toResponse(c, currentUser)).collect(Collectors.toList());
    }

    @Override
    public CommentResponse update(Integer commentId, CommentRequest request) {
        Comment comment = findOrThrow(commentId);
        User currentUser = getCurrentUser();

        // Chỉ chủ comment mới được sửa
        if (!comment.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền sửa bình luận này");
        }

        // Không sửa được sau final_closure_date
        if (LocalDate.now().isAfter(comment.getIdea().getAcademicYear().getFinalClosureDate())) {
            throw new BadRequestException("Đã hết hạn chỉnh sửa bình luận");
        }

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new BadRequestException("Nội dung bình luận không được để trống");
        }

        comment.setContent(request.getContent());
        if (request.getIsAnonymous() != null) {
            comment.setIsAnonymous(request.getIsAnonymous());
        }
        comment.setUpdatedAt(LocalDateTime.now());

        return toResponse(commentRepository.save(comment), currentUser);
    }

    @Override
    public void delete(Integer commentId) {
        Comment comment = findOrThrow(commentId);
        User currentUser = getCurrentUser();

        // ADMIN hoặc chủ comment mới được xóa
        String role = currentUser.getRole() != null ? currentUser.getRole().getRoleName() : "";
        if (!role.equals("ADMIN") && !comment.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền xóa bình luận này");
        }

        commentRepository.delete(comment);
    }

    // --- helpers ---

    private Comment findOrThrow(Integer commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bình luận với id: " + commentId));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user hiện tại"));
    }

    /**
     * Chuyển Comment entity sang DTO.
     * Nếu comment ẩn danh và người xem không phải ADMIN/QA_MGR → ẩn tên và id tác giả.
     */
    private CommentResponse toResponse(Comment comment, User viewer) {
        String role = viewer.getRole() != null ? viewer.getRole().getRoleName() : "";
        boolean canSeeIdentity = role.equals("ADMIN") || role.equals("QA_MGR");
        boolean anonymous = Boolean.TRUE.equals(comment.getIsAnonymous());

        String authorName = (anonymous && !canSeeIdentity) ? "Ẩn danh" : comment.getUser().getFullName();
        Integer authorId = (anonymous && !canSeeIdentity) ? null : comment.getUser().getUserId();

        return new CommentResponse(
                comment.getCommentId(),
                comment.getIdea().getIdeaId(),
                authorName,
                authorId,
                comment.getContent(),
                comment.getIsAnonymous(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
