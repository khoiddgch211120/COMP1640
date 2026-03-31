package com.example.comp1640.service.impl;

import com.example.comp1640.dto.request.TermsConditionsRequest;
import com.example.comp1640.dto.response.TermsConditionsResponse;
import com.example.comp1640.entity.TermsConditions;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.repository.TermsConditionsRepository;
import com.example.comp1640.service.TermsConditionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TermsConditionsServiceImpl implements TermsConditionsService {

    private final TermsConditionsRepository termsRepo;

    /**
     * Trả về tất cả versions sắp xếp mới nhất trước (version DESC).
     * Frontend dùng để render timeline.
     */
    @Override
    public List<TermsConditionsResponse> getAll() {
        return termsRepo.findAll()
                .stream()
                .sorted(Comparator.comparingInt(TermsConditions::getVersion).reversed())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy version cao nhất = version đang active.
     * Frontend hiển thị trong "Current Version" card.
     */
    @Override
    public TermsConditionsResponse getCurrent() {
        TermsConditions current = termsRepo.findTopByOrderByVersionDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có Terms & Conditions nào trong hệ thống"));
        return toResponse(current);
    }

    @Override
    public TermsConditionsResponse getById(Integer id) {
        return toResponse(findOrThrow(id));
    }

    /**
     * Tạo version mới:
     *  - version = max(version hiện tại) + 1, tự động tính trong Service
     *  - Frontend chỉ gửi { content, effective_date }
     *  - Sau khi tạo, version mới này trở thành "current" (có version cao nhất)
     */
    @Override
    public TermsConditionsResponse create(TermsConditionsRequest request) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new BadRequestException("Nội dung Terms & Conditions không được để trống");
        }
        if (request.getEffectiveDate() == null) {
            throw new BadRequestException("effective_date không được để trống");
        }

        // Tính version tiếp theo
        Integer nextVersion = termsRepo.findMaxVersion() + 1;

        TermsConditions tc = new TermsConditions();
        tc.setVersion(nextVersion);
        tc.setContent(request.getContent().trim());
        tc.setEffectiveDate(request.getEffectiveDate());
        tc.setCreatedAt(LocalDateTime.now());

        return toResponse(termsRepo.save(tc));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private TermsConditions findOrThrow(Integer id) {
        return termsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Terms & Conditions với id: " + id));
    }

    /**
     * Map entity → response.
     * Tên field khớp với frontend (sau khi đã bật SNAKE_CASE Jackson):
     *   tcId          → tc_id
     *   version       → version
     *   content       → content
     *   effectiveDate → effective_date
     *   createdAt     → created_at
     */
    private TermsConditionsResponse toResponse(TermsConditions tc) {
        return new TermsConditionsResponse(
                tc.getTcId(),
                tc.getVersion(),
                tc.getContent(),
                tc.getEffectiveDate(),
                tc.getCreatedAt()
        );
    }
}