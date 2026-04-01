package com.example.comp1640.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.comp1640.dto.request.TermsConditionsRequest;
import com.example.comp1640.dto.response.TermsConditionsResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.model.TermsConditions;
import com.example.comp1640.model.User;
import com.example.comp1640.model.UserTermsAcceptance;
import com.example.comp1640.repository.TermsConditionsRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.repository.UserTermsAcceptanceRepository;
import com.example.comp1640.service.TermsConditionsService;

@Service
public class TermsConditionsServiceImpl implements TermsConditionsService {

    private final TermsConditionsRepository termsRepo;
    private final UserRepository userRepo;
    private final UserTermsAcceptanceRepository acceptanceRepo;

    public TermsConditionsServiceImpl(TermsConditionsRepository termsRepo,
                                      UserRepository userRepo,
                                      UserTermsAcceptanceRepository acceptanceRepo) {
        this.termsRepo = termsRepo;
        this.userRepo = userRepo;
        this.acceptanceRepo = acceptanceRepo;
    }

    @Override
    public TermsConditionsResponse getLatest() {
        TermsConditions terms = termsRepo.findTopByOrderByCreatedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có điều khoản nào được tạo"));
        return toResponse(terms);
    }

    @Override
    @Transactional
    public TermsConditionsResponse create(TermsConditionsRequest request) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new BadRequestException("Nội dung điều khoản không được để trống");
        }
        if (request.getVersion() == null || request.getVersion().isBlank()) {
            throw new BadRequestException("Phiên bản điều khoản không được để trống");
        }

        User currentUser = getCurrentUser();

        TermsConditions terms = new TermsConditions();
        terms.setCreatedBy(currentUser);
        terms.setVersion(request.getVersion());
        terms.setContent(request.getContent());
        terms.setEffectiveDate(request.getEffectiveDate());
        terms.setCreatedAt(LocalDateTime.now());

        return toResponse(termsRepo.save(terms));
    }

    @Override
    @Transactional
    public void accept() {
        TermsConditions latest = termsRepo.findTopByOrderByCreatedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có điều khoản nào để chấp nhận"));

        User currentUser = getCurrentUser();

        // Nếu đã chấp nhận phiên bản này rồi thì bỏ qua
        if (acceptanceRepo.existsByUser_UserIdAndTermsConditions_TermsId(
                currentUser.getUserId(), latest.getTermsId())) {
            return;
        }

        UserTermsAcceptance acceptance = new UserTermsAcceptance(currentUser, latest, LocalDateTime.now());
        acceptanceRepo.save(acceptance);
    }

    // --- helpers ---

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BadRequestException("Chưa đăng nhập");
        }
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user hiện tại"));
    }

    private TermsConditionsResponse toResponse(TermsConditions t) {
        return new TermsConditionsResponse(
                t.getTermsId(),
                t.getVersion(),
                t.getContent(),
                t.getEffectiveDate(),
                t.getCreatedBy() != null ? t.getCreatedBy().getFullName() : null,
                t.getCreatedAt()
        );
    }
}
