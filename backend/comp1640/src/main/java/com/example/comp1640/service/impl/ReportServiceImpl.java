package com.example.comp1640.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.comp1640.dto.response.IdeaResponse;
import com.example.comp1640.dto.response.ReportStatsResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.model.AcademicYear;
import com.example.comp1640.model.Category;
import com.example.comp1640.model.Document;
import com.example.comp1640.model.Idea;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.AcademicYearRepository;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.DocumentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.repository.VoteRepository;
import com.example.comp1640.service.ReportService;
import com.opencsv.CSVWriter;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final IdeaRepository ideaRepo;
    private final CommentRepository commentRepo;
    private final VoteRepository voteRepo;
    private final UserRepository userRepo;
    private final AcademicYearRepository academicYearRepo;
    private final DocumentRepository documentRepo;

    public ReportServiceImpl(IdeaRepository ideaRepo, CommentRepository commentRepo,
            VoteRepository voteRepo, UserRepository userRepo,
            AcademicYearRepository academicYearRepo,
            DocumentRepository documentRepo) {
        this.ideaRepo = ideaRepo;
        this.commentRepo = commentRepo;
        this.voteRepo = voteRepo;
        this.userRepo = userRepo;
        this.academicYearRepo = academicYearRepo;
        this.documentRepo = documentRepo;
    }

    @Override
    public ReportStatsResponse getStats(Integer yearId, Integer deptId) {
        long totalIdeas = ideaRepo.countFiltered(yearId, deptId);
        long totalComments = commentRepo.countFiltered(yearId, deptId);
        long totalVotes = voteRepo.countFiltered(yearId, deptId);
        long totalContributors = ideaRepo.countDistinctContributors(yearId, deptId);
        long anonymousIdeas = ideaRepo.countAnonymous(yearId, deptId);
        double anonymousRate = totalIdeas > 0 ? (double) anonymousIdeas / totalIdeas * 100 : 0.0;

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
                byDept, byCategory);
    }

    @Override
    public List<IdeaResponse> getNoCommentIdeas(Integer yearId, Integer deptId) {
        User currentUser = getCurrentUserOptional().orElse(null);
        return ideaRepo.findNoComment(yearId, deptId)
                .stream()
                .map(i -> toResponse(i, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public byte[] exportIdeasCsv(Integer yearId) {
        AcademicYear year = academicYearRepo.findById(yearId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học id: " + yearId));

        if (LocalDate.now().isBefore(year.getFinalClosureDate())) {
            throw new BadRequestException("Chỉ được xuất CSV sau ngày đóng cửa cuối: " + year.getFinalClosureDate());
        }

        List<Idea> ideas = ideaRepo.findByAcademicYear_YearId(yearId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8))) {
            // BOM cho Excel đọc UTF-8
            baos.write(0xEF);
            baos.write(0xBB);
            baos.write(0xBF);

            writer.writeNext(new String[] {
                    "ID", "Tiêu đề", "Nội dung", "Tác giả", "Phòng ban",
                    "Danh mục", "Ẩn danh", "Lượt xem", "Upvote", "Downvote",
                    "Ngày gửi", "Ngày cập nhật"
            });

            for (Idea idea : ideas) {
                String categories = idea.getCategories().stream()
                        .map(Category::getCategoryName)
                        .collect(Collectors.joining("; "));
                long up = voteRepo.countUpvotes(idea.getIdeaId());
                long down = voteRepo.countDownvotes(idea.getIdeaId());

                writer.writeNext(new String[] {
                        String.valueOf(idea.getIdeaId()),
                        idea.getTitle(),
                        idea.getContent(),
                        Boolean.TRUE.equals(idea.getIsAnonymous()) ? "Ẩn danh" : idea.getUser().getFullName(),
                        idea.getDepartment() != null ? idea.getDepartment().getDeptName() : "",
                        categories,
                        Boolean.TRUE.equals(idea.getIsAnonymous()) ? "Có" : "Không",
                        String.valueOf(idea.getViewCount()),
                        String.valueOf(up),
                        String.valueOf(down),
                        idea.getSubmittedAt() != null ? idea.getSubmittedAt().toString() : "",
                        idea.getUpdatedAt() != null ? idea.getUpdatedAt().toString() : ""
                });
            }
        } catch (IOException e) {
            throw new BadRequestException("Xuất CSV thất bại: " + e.getMessage());
        }

        return baos.toByteArray();
    }

    @Override
    public byte[] exportDocumentsZip(Integer yearId) {
        AcademicYear year = academicYearRepo.findById(yearId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học id: " + yearId));

        if (LocalDate.now().isBefore(year.getFinalClosureDate())) {
            throw new BadRequestException("Chỉ được xuất ZIP sau ngày đóng cửa cuối: " + year.getFinalClosureDate());
        }

        List<Idea> ideas = ideaRepo.findByAcademicYear_YearId(yearId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (Idea idea : ideas) {
                List<Document> docs = documentRepo.findByIdeaIdeaId(idea.getIdeaId());
                for (Document doc : docs) {
                    String entryName = "idea_" + idea.getIdeaId() + "/" + doc.getFileName();
                    zos.putNextEntry(new ZipEntry(entryName));
                    try (var in = new URL(doc.getFileUrl()).openStream()) {
                        in.transferTo(zos);
                    } catch (IOException e) {
                        // Ghi note thay thế nếu không download được
                        zos.write(("Cannot download: " + doc.getFileUrl()).getBytes(StandardCharsets.UTF_8));
                    }
                    zos.closeEntry();
                }
            }
        } catch (IOException e) {
            throw new BadRequestException("Xuất ZIP thất bại: " + e.getMessage());
        }

        return baos.toByteArray();
    }

    // --- helpers ---

    private Optional<User> getCurrentUserOptional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return Optional.empty();
        }
        return userRepo.findByEmail(auth.getName());
    }

    private boolean canViewIdentity(User viewer) {
        if (viewer == null)
            return false;
        String role = viewer.getRole() != null ? viewer.getRole().getRoleName() : "";
        return role.equals("ADMIN") || role.equals("QA_MGR");
    }

    private IdeaResponse toResponse(Idea idea, User viewer) {
        boolean showIdentity = !Boolean.TRUE.equals(idea.getIsAnonymous()) || canViewIdentity(viewer);

        Set<String> categoryNames = idea.getCategories().stream()
                .map(Category::getCategoryName)
                .collect(Collectors.toSet());

        long upvotes = voteRepo.countUpvotes(idea.getIdeaId());
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
                idea.getUpdatedAt());
    }
}
