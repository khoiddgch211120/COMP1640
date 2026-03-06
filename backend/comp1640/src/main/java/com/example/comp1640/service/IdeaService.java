package com.example.comp1640.service.impl;

import com.example.comp1640.dto.request.IdeaRequest;
import com.example.comp1640.dto.response.IdeaResponse;
import com.example.comp1640.entity.*;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.repository.*;
import com.example.comp1640.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class IdeaService {

    private final IdeaRepository              ideaRepository;
    private final UserRepository              userRepository;
    private final DepartmentRepository        deptRepository;
    private final AcademicYearRepository      yearRepository;
    private final CategoryRepository          categoryRepository;
    private final UserTermsAcceptanceRepository acceptanceRepo;
    private final TermsConditionRepository    termsRepo;
    private final VoteRepository              voteRepository;
    private final NotificationService         notificationService;

    // ── Read ────────────────────────────────────────────────────────────

    public Page<IdeaResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ideaRepository.findAllByOrderBySubmittedAtDesc(pageable)
                .map(idea -> toResponse(idea, currentUser()));
    }

    public Page<IdeaResponse> getMostViewed(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ideaRepository.findAllByOrderByViewCountDesc(pageable)
                .map(idea -> toResponse(idea, currentUser()));
    }

    public Page<IdeaResponse> getMostPopular(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ideaRepository.findMostPopular(pageable)
                .map(idea -> toResponse(idea, currentUser()));
    }

    @Transactional
    public IdeaResponse getById(Integer id) {
        Idea idea = findIdea(id);
        idea.setViewCount(idea.getViewCount() + 1);   // increment view
        ideaRepository.save(idea);
        return toResponse(idea, currentUser());
    }

    // ── Create ──────────────────────────────────────────────────────────

    @Transactional
    public IdeaResponse create(IdeaRequest req) {
        UserDetailsImpl principal = currentUser();
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 1. Check latest T&C acceptance
        termsRepo.findTopByOrderByVersionDesc().ifPresent(tc -> {
            if (!acceptanceRepo.existsByUserIdAndTcId(user.getUserId(), tc.getTcId()))
                throw new BadRequestException("You must accept the Terms & Conditions before submitting");
        });

        // 2. Get current academic year and check idea closure date
        AcademicYear year = yearRepository.findTopByOrderByYearIdDesc()
                .orElseThrow(() -> new ResourceNotFoundException("No active academic year found"));
        if (LocalDate.now().isAfter(year.getIdeaClosureDate()))
            throw new BadRequestException("Idea submission is closed for this academic year");

        // 3. Resolve department (staff submits under their own dept)
        Department dept = deptRepository.findById(user.getDepartment().getDeptId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        // 4. Resolve categories
        Set<Category> categories = new HashSet<>();
        if (req.categoryIds() != null) {
            for (Integer catId : req.categoryIds()) {
                Category cat = categoryRepository.findById(catId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + catId));
                cat.setIsUsed(true);
                categories.add(cat);
            }
        }

        Idea idea = Idea.builder()
                .user(user)
                .department(dept)
                .academicYear(year)
                .title(req.title())
                .content(req.content())
                .isAnonymous(req.isAnonymous() != null ? req.isAnonymous() : false)
                .termsAccepted(true)
                .categories(categories)
                .build();

        Idea saved = ideaRepository.save(idea);

        // 5. Async email to QA Coordinator
        notificationService.sendNewIdeaNotification(saved);

        return toResponse(saved, principal);
    }

    // ── Update ──────────────────────────────────────────────────────────

    @Transactional
    public IdeaResponse update(Integer id, IdeaRequest req) {
        Idea idea = findIdea(id);
        UserDetailsImpl principal = currentUser();

        if (!idea.getUser().getUserId().equals(principal.getUserId()))
            throw new BadRequestException("You can only edit your own ideas");

        AcademicYear year = idea.getAcademicYear();
        if (LocalDate.now().isAfter(year.getIdeaClosureDate()))
            throw new BadRequestException("Cannot edit idea after closure date");

        idea.setTitle(req.title());
        idea.setContent(req.content());
        if (req.isAnonymous() != null) idea.setIsAnonymous(req.isAnonymous());
        return toResponse(ideaRepository.save(idea), principal);
    }

    // ── Helpers ─────────────────────────────────────────────────────────

    public Idea findIdea(Integer id) {
        return ideaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Idea not found: " + id));
    }

    private IdeaResponse toResponse(Idea idea, UserDetailsImpl currentUser) {
        boolean showAuthor = !idea.getIsAnonymous();
        Integer score = voteRepository.sumVotesByIdeaId(idea.getIdeaId());
        Integer myVote = null;
        if (currentUser != null) {
            myVote = voteRepository.findByIdea_IdeaIdAndUser_UserId(idea.getIdeaId(), currentUser.getUserId())
                    .map(Vote::getVoteType).orElse(null);
        }
        return IdeaResponse.from(idea, showAuthor, score, myVote);
    }

    private UserDetailsImpl currentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal instanceof UserDetailsImpl u ? u : null;
    }
}
