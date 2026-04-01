package com.example.comp1640.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.comp1640.dto.request.AcademicYearRequest;
import com.example.comp1640.dto.response.AcademicYearResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.entity.AcademicYear;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.AcademicYearRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.AcademicYearService;

@Service
public class AcademicYearServiceImpl implements AcademicYearService {

    private final AcademicYearRepository academicYearRepo;
    private final UserRepository userRepo;

    public AcademicYearServiceImpl(AcademicYearRepository academicYearRepo, UserRepository userRepo) {
        this.academicYearRepo = academicYearRepo;
        this.userRepo = userRepo;
    }

    @Override
    public AcademicYearResponse create(AcademicYearRequest request) {
        validateRequest(request);

        if (academicYearRepo.existsByYearLabel(request.getYearLabel())) {
            throw new BadRequestException("Năm học '" + request.getYearLabel() + "' đã tồn tại");
        }

        User currentUser = getCurrentUser();

        AcademicYear year = new AcademicYear();
        year.setYearLabel(request.getYearLabel());
        year.setIdeaClosureDate(request.getIdeaClosureDate());
        year.setFinalClosureDate(request.getFinalClosureDate());
        year.setCreatedBy(currentUser);
        year.setCreatedAt(LocalDateTime.now());

        return toResponse(academicYearRepo.save(year));
    }

    @Override
    public List<AcademicYearResponse> getAll() {
        return academicYearRepo.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AcademicYearResponse getById(Integer id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    public AcademicYearResponse getCurrent() {
        AcademicYear year = academicYearRepo.findCurrent(LocalDate.now())
                .orElseThrow(() -> new ResourceNotFoundException("Không có năm học đang hoạt động"));
        return toResponse(year);
    }

    @Override
    public AcademicYearResponse update(Integer id, AcademicYearRequest request) {
        AcademicYear year = findOrThrow(id);

        if (request.getYearLabel() != null && !request.getYearLabel().isBlank()) {
            if (!request.getYearLabel().equals(year.getYearLabel())
                    && academicYearRepo.existsByYearLabel(request.getYearLabel())) {
                throw new BadRequestException("Năm học '" + request.getYearLabel() + "' đã tồn tại");
            }
            year.setYearLabel(request.getYearLabel());
        }

        LocalDate newIdeaDate = request.getIdeaClosureDate() != null
                ? request.getIdeaClosureDate()
                : year.getIdeaClosureDate();
        LocalDate newFinalDate = request.getFinalClosureDate() != null
                ? request.getFinalClosureDate()
                : year.getFinalClosureDate();

        if (!newIdeaDate.isBefore(newFinalDate)) {
            throw new BadRequestException("Ngày đóng ý tưởng phải trước ngày đóng bình luận");
        }

        year.setIdeaClosureDate(newIdeaDate);
        year.setFinalClosureDate(newFinalDate);

        return toResponse(academicYearRepo.save(year));
    }

    @Override
    public void delete(Integer id) {
        if (!academicYearRepo.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy năm học với id: " + id);
        }
        academicYearRepo.deleteById(id);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private void validateRequest(AcademicYearRequest request) {
        if (request.getYearLabel() == null || request.getYearLabel().isBlank()) {
            throw new BadRequestException("Tên năm học không được để trống");
        }
        if (request.getIdeaClosureDate() == null || request.getFinalClosureDate() == null) {
            throw new BadRequestException("Ngày đóng ý tưởng và ngày đóng bình luận không được để trống");
        }
        if (!request.getIdeaClosureDate().isBefore(request.getFinalClosureDate())) {
            throw new BadRequestException("Ngày đóng ý tưởng phải trước ngày đóng bình luận");
        }
    }

    private AcademicYear findOrThrow(Integer id) {
        return academicYearRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học với id: " + id));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user hiện tại"));
    }

    /**
     * Tính status theo logic:
     *  - upcoming : hôm nay TRƯỚC idea_closure_date
     *  - active   : hôm nay SAU idea_closure_date nhưng TRƯỚC final_closure_date
     *  - closed   : hôm nay SAU final_closure_date
     *
     * Thêm createdBy (Integer user_id) và status (String) vào response
     * để frontend AcademicYearManagement.jsx hiển thị đúng badge.
     */
    private AcademicYearResponse toResponse(AcademicYear a) {
        LocalDate today = LocalDate.now();

        boolean ideaOpen    = !today.isAfter(a.getIdeaClosureDate());
        boolean commentOpen = !today.isAfter(a.getFinalClosureDate());

        String status;
        if (today.isBefore(a.getIdeaClosureDate())) {
            status = "upcoming";
        } else if (!today.isAfter(a.getFinalClosureDate())) {
            status = "active";
        } else {
            status = "closed";
        }

        AcademicYearResponse resp = new AcademicYearResponse();
        resp.setYearId(a.getYearId());
        resp.setYearLabel(a.getYearLabel());
        resp.setIdeaClosureDate(a.getIdeaClosureDate());
        resp.setFinalClosureDate(a.getFinalClosureDate());
        resp.setCreatedBy(a.getCreatedBy() != null ? a.getCreatedBy().getUserId() : null);
        resp.setCreatedByName(a.getCreatedBy() != null ? a.getCreatedBy().getFullName() : null);
        resp.setCreatedAt(a.getCreatedAt());
        resp.setIdeaOpen(ideaOpen);
        resp.setCommentOpen(commentOpen);
        resp.setStatus(status);
        return resp;
    }
}