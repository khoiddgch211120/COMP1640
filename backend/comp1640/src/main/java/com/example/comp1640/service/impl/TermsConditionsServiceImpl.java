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
import com.example.comp1640.repository.TermsConditionsRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.TermsConditionsService;

@Service
public class TermsConditionsServiceImpl implements TermsConditionsService {

    private final TermsConditionsRepository termsRepo;
    private final UserRepository userRepo;

    public TermsConditionsServiceImpl(TermsConditionsRepository termsRepo, UserRepository userRepo) {
        this.termsRepo = termsRepo;
        this.userRepo = userRepo;
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
        // Ensure terms exist before accepting
        termsRepo.findTopByOrderByCreatedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có điều khoản nào để chấp nhận"));

        User currentUser = getCurrentUser();
        currentUser.setTermsAcceptedAt(LocalDateTime.now());
        userRepo.save(currentUser);
    }

    // --- helpers ---

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
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
