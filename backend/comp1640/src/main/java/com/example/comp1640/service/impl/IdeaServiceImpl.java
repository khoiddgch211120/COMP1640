package com.example.comp1640.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.comp1640.dto.request.IdeaRequest;
import com.example.comp1640.dto.response.IdeaResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.exception.UnauthorizedException;
import com.example.comp1640.model.AcademicYear;
import com.example.comp1640.model.Category;
import com.example.comp1640.model.Idea;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.AcademicYearRepository;
import com.example.comp1640.repository.CategoryRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.repository.VoteRepository;
import com.example.comp1640.service.IdeaService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IdeaServiceImpl implements IdeaService {

    private final IdeaRepository ideaRepo;
    private final UserRepository userRepo;
    private final AcademicYearRepository academicYearRepo;
    private final CategoryRepository categoryRepo;
    private final VoteRepository voteRepo;

    @Override
    @Transactional
    public IdeaResponse submit(IdeaRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new BadRequestException("Tiêu đề không được để trống");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new BadRequestException("Nội dung không được để trống");
        }
        if (!Boolean.TRUE.equals(request.getTermsAccepted())) {
            throw new BadRequestException("Bạn phải chấp nhận điều khoản trước khi gửi ý tưởng");
        }

        AcademicYear year = academicYearRepo.findById(request.getYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học"));

        if (!LocalDate.now().isBefore(year.getIdeaClosureDate())
                && !LocalDate.now().isEqual(year.getIdeaClosureDate())) {
            throw new BadRequestException("Đã hết hạn nộp ý tưởng cho năm học này");
        }

        User currentUser = getCurrentUser();

        Idea idea = new Idea();
        idea.setUser(currentUser);
        idea.setDepartment(currentUser.getDepartment());
        idea.setAcademicYear(year);
        idea.setTitle(request.getTitle());
        idea.setContent(request.getContent());
        idea.setIsAnonymous(Boolean.TRUE.equals(request.getIsAnonymous()));
        idea.setTermsAccepted(true);
        idea.setIsDisabled(false);
        idea.setViewCount(0);
        idea.setSubmittedAt(LocalDateTime.now());
        idea.setUpdatedAt(LocalDateTime.now());

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = request.getCategoryIds().stream()
                    .map(id -> categoryRepo.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy category id: " + id)))
                    .collect(Collectors.toSet());
            idea.setCategories(categories);

            // Đánh dấu category đã được dùng
            categories.forEach(c -> c.setIsUsed(true));
            categoryRepo.saveAll(categories);
        }

        return toResponse(ideaRepo.save(idea), currentUser);
    }

    @Override
    public Page<IdeaResponse> getAll(Integer yearId, Integer deptId, Pageable pageable) {
        Page<Idea> ideas;
        if (yearId != null && deptId != null) {
            ideas = ideaRepo.findByAcademicYear_YearIdAndDepartment_DeptId(yearId, deptId, pageable);
        } else if (yearId != null) {
            ideas = ideaRepo.findByAcademicYear_YearId(yearId, pageable);
        } else if (deptId != null) {
            ideas = ideaRepo.findByDepartment_DeptId(deptId, pageable);
        } else {
            ideas = ideaRepo.findAll(pageable);
        }

        // Cho phép guest xem (không cần đăng nhập)
        User currentUser = getCurrentUserOptional().orElse(null);
        return ideas.map(i -> toResponse(i, currentUser));
    }

    @Override
    public Page<IdeaResponse> getMostPopular(Pageable pageable) {
        User currentUser = getCurrentUserOptional().orElse(null);
        return ideaRepo.findMostPopular(pageable).map(i -> toResponse(i, currentUser));
    }

    @Override
    public Page<IdeaResponse> getLatest(Pageable pageable) {
        User currentUser = getCurrentUserOptional().orElse(null);
        return ideaRepo.findLatest(pageable).map(i -> toResponse(i, currentUser));
    }

    @Override
    @Transactional
    public IdeaResponse getById(Integer id) {
        Idea idea = findOrThrow(id);
        // Tăng view count
        idea.setViewCount(idea.getViewCount() + 1);
        ideaRepo.save(idea);
        // Cho phép guest xem
        User currentUser = getCurrentUserOptional().orElse(null);
        return toResponse(idea, currentUser);
    }

    @Override
    @Transactional
    public IdeaResponse update(Integer id, IdeaRequest request) {
        Idea idea = findOrThrow(id);
        User currentUser = getCurrentUser();

        // Chỉ chủ ý tưởng mới được sửa
        if (!idea.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedException("Bạn không có quyền sửa ý tưởng này");
        }

        // Không sửa được sau khi hết hạn idea_closure_date
        AcademicYear year = idea.getAcademicYear();
        if (LocalDate.now().isAfter(year.getIdeaClosureDate())) {
            throw new BadRequestException("Đã hết hạn chỉnh sửa ý tưởng");
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            idea.setTitle(request.getTitle());
        }
        if (request.getContent() != null && !request.getContent().isBlank()) {
            idea.setContent(request.getContent());
        }
        if (request.getIsAnonymous() != null) {
            idea.setIsAnonymous(request.getIsAnonymous());
        }
        if (request.getCategoryIds() != null) {
            Set<Category> categories = request.getCategoryIds().stream()
                    .map(cid -> categoryRepo.findById(cid)
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy category id: " + cid)))
                    .collect(Collectors.toSet());
            idea.setCategories(categories);
            categories.forEach(c -> c.setIsUsed(true));
            categoryRepo.saveAll(categories);
        }
        idea.setUpdatedAt(LocalDateTime.now());

        return toResponse(ideaRepo.save(idea), currentUser);
    }

    @Override
    public void delete(Integer id) {
        Idea idea = findOrThrow(id);
        User currentUser = getCurrentUser();
        String role = currentUser.getRole() != null ? currentUser.getRole().getRoleName() : "";

        // ADMIN hoặc chủ idea mới được xóa
        if (!role.equals("ADMIN") && !idea.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedException("Bạn không có quyền xóa ý tưởng này");
        }
        ideaRepo.deleteById(id);
    }

    @Override
    public List<IdeaResponse> getMostViewed(Integer yearId) {
        // Cho phép guest xem
        User currentUser = getCurrentUserOptional().orElse(null);
        return ideaRepo.findMostViewed(yearId).stream()
                .map(i -> toResponse(i, currentUser))
                .collect(Collectors.toList());
    }

    // --- helpers ---

    private Idea findOrThrow(Integer id) {
        return ideaRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ý tưởng với id: " + id));
    }

    /** Lấy user đang đăng nhập, ném lỗi nếu chưa xác thực */
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user hiện tại"));
    }

    /** Lấy user đang đăng nhập, trả về empty nếu là guest (không cần đăng nhập) */
    private Optional<User> getCurrentUserOptional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return Optional.empty();
        }
        return userRepo.findByEmail(auth.getName());
    }

    /**
     * ADMIN và QA_MGR được xem danh tính thật của ý tưởng ẩn danh.
     * Guest (viewer = null) không được xem.
     */
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
