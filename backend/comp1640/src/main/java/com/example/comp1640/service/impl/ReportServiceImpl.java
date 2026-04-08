package com.example.comp1640.service.impl;

import com.example.comp1640.dto.response.AnonymousContentResponse;
import com.example.comp1640.dto.response.IdeaNoCommentResponse;
import com.example.comp1640.dto.response.StatisticsReportResponse;
import com.example.comp1640.dto.response.ComprehensiveStatisticsResponse;
import com.example.comp1640.dto.response.TopContributorDto;
import com.example.comp1640.dto.response.MonthlyTrendDto;
import com.example.comp1640.dto.response.DepartmentBreakdownDto;
import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.Department;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.DepartmentRepository;
import com.example.comp1640.repository.IdeaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.comp1640.service.ReportService;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

   private final IdeaRepository ideaRepository;
   private final CommentRepository commentRepository;
   private final DepartmentRepository departmentRepository;

   public ReportServiceImpl(IdeaRepository ideaRepository, CommentRepository commentRepository,
         DepartmentRepository departmentRepository) {
      this.ideaRepository = ideaRepository;
      this.commentRepository = commentRepository;
      this.departmentRepository = departmentRepository;
   }

   @Override
   public List<StatisticsReportResponse> getStatisticsReport(Integer yearId, Integer deptId) {
      List<Idea> ideas;

      if (yearId != null) {
         ideas = deptId != null
               ? ideaRepository.findByAcademicYear_YearIdAndDepartment_DeptId(yearId, deptId)
               : ideaRepository.findByAcademicYear_YearId(yearId);
      } else {
         ideas = deptId != null
               ? ideaRepository.findByDepartment_DeptId(deptId)
               : ideaRepository.findAll();
      }

      long totalIdeas = ideas.size();
      if (totalIdeas == 0) {
         return new ArrayList<>();
      }

      // Group ideas by department
      Map<Integer, List<Idea>> ideaByDept = ideas.stream()
            .collect(Collectors.groupingBy(i -> i.getDepartment() != null ? i.getDepartment().getDeptId() : -1));

      // Get all departments
      List<Department> departments = departmentRepository.findAll();

      // Build statistics
      return departments.stream()
            .map(dept -> {
               List<Idea> deptIdeas = ideaByDept.getOrDefault(dept.getDeptId(), new ArrayList<>());
               long deptIdeaCount = deptIdeas.size();
               double percentage = totalIdeas > 0 ? (deptIdeaCount * 100.0) / totalIdeas : 0;

               // Count unique contributors
               long contributorCount = deptIdeas.stream()
                     .map(idea -> idea.getUser() != null ? idea.getUser().getUserId() : null)
                     .distinct()
                     .count();

               return StatisticsReportResponse.builder()
                     .deptId(dept.getDeptId())
                     .deptName(dept.getDeptName())
                     .ideaCount((int) deptIdeaCount)
                     .percentageOfTotal(Math.round(percentage * 100.0) / 100.0)
                     .contributorCount((int) contributorCount)
                     .build();
            })
            .collect(Collectors.toList());
   }

   @Override
   public List<IdeaNoCommentResponse> getIdeasWithoutComments(Integer yearId) {
      List<Idea> ideasWithoutComments = yearId != null
            ? ideaRepository.findIdeasWithoutComments(yearId)
            : ideaRepository.findAllIdeasWithoutComments();

      return ideasWithoutComments.stream()
            .map(idea -> IdeaNoCommentResponse.from(idea))
            .collect(Collectors.toList());
   }

   @Override
   public List<AnonymousContentResponse> getAnonymousContent(Integer yearId) {
      List<AnonymousContentResponse> anonymousContents = new ArrayList<>();

      // Get anonymous ideas
      List<Idea> anonymousIdeas = yearId != null
            ? ideaRepository.findAnonymousIdeas(yearId)
            : ideaRepository.findAllAnonymousIdeas();

      anonymousIdeas.forEach(idea -> {
         anonymousContents.add(AnonymousContentResponse.builder()
               .contentType("IDEA")
               .contentId(idea.getIdeaId())
               .contentPreview(idea.getTitle().substring(0, Math.min(100, idea.getTitle().length())))
               .authorRealName(idea.getUser() != null ? idea.getUser().getFullName() : "Unknown")
               .isAnonymous(true)
               .createdAt(idea.getSubmittedAt())
               .build());
      });

      // Get anonymous comments
      List<Comment> anonymousComments = yearId != null
            ? commentRepository.findAnonymousCommentsByYear(yearId)
            : commentRepository.findAllAnonymousComments();

      anonymousComments.forEach(comment -> {
         anonymousContents.add(AnonymousContentResponse.builder()
               .contentType("COMMENT")
               .contentId(comment.getCommentId())
               .contentPreview(comment.getContent().substring(0, Math.min(100, comment.getContent().length())))
               .authorRealName(comment.getUser() != null ? comment.getUser().getFullName() : "Unknown")
               .isAnonymous(true)
               .createdAt(comment.getCreatedAt())
               .build());
      });

      // Sort by createdAt descending
      anonymousContents.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

      return anonymousContents;
   }

   @Override
   public ComprehensiveStatisticsResponse getComprehensiveStatistics(Integer yearId, Integer deptId) {
      // Fetch ideas based on filters
      List<Idea> ideas;
      List<Comment> allComments;

      if (yearId != null) {
         // Filter by specific year
         ideas = deptId != null
               ? ideaRepository.findByAcademicYear_YearIdAndDepartment_DeptId(yearId, deptId)
               : ideaRepository.findByAcademicYear_YearId(yearId);
         allComments = commentRepository.findByIdea_AcademicYear_YearId(yearId);
      } else {
         // No year filter - get all ideas
         ideas = deptId != null
               ? ideaRepository.findByDepartment_DeptId(deptId)
               : ideaRepository.findAll();
         allComments = commentRepository.findAll();
      }

      // Calculate basic totals
      Integer totalIdeas = ideas.size();

      // Filter comments to only those on ideas in current filter
      List<Integer> ideaIds = ideas.stream()
            .map(Idea::getIdeaId)
            .collect(Collectors.toList());

      List<Comment> filteredComments = allComments.stream()
            .filter(c -> c.getIdea() != null && ideaIds.contains(c.getIdea().getIdeaId()))
            .collect(Collectors.toList());

      Integer totalComments = filteredComments.size();
      Integer anonymousIdeas = (int) ideas.stream().filter(i -> Boolean.TRUE.equals(i.getIsAnonymous())).count();

      // Count ideas with/without comments
      Set<Integer> ideasWithComments = filteredComments.stream()
            .map(c -> c.getIdea() != null ? c.getIdea().getIdeaId() : null)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
      Integer ideasWithCommentsCount = ideasWithComments.size();
      Integer ideasWithoutCommentsCount = totalIdeas - ideasWithCommentsCount;

      // Count unique users across all ideas
      Set<Integer> uniqueUsers = ideas.stream()
            .map(i -> i.getUser() != null ? i.getUser().getUserId() : null)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
      Integer totalUsers = uniqueUsers.size();

      // Group ideas by department for breakdown
      Map<Integer, List<Idea>> ideaByDept = ideas.stream()
            .collect(Collectors.groupingBy(i -> i.getDepartment() != null ? i.getDepartment().getDeptId() : -1));

      // Get department breakdown
      List<DepartmentBreakdownDto> byDepartment = new ArrayList<>();
      ideaByDept.forEach((deptIdKey, deptIdeas) -> {
         if (deptIdKey != -1) {
            Department dept = departmentRepository.findById(deptIdKey).orElse(null);
            if (dept != null) {
               // Count users in this department
               long deptUserCount = deptIdeas.stream()
                     .map(i -> i.getUser() != null ? i.getUser().getUserId() : null)
                     .distinct()
                     .count();

               // Count comments for ideas in this department
               long deptCommentCount = filteredComments.stream()
                     .filter(c -> c.getIdea() != null && deptIdeas.contains(c.getIdea()))
                     .count();

               double percent = totalIdeas > 0 ? (deptIdeas.size() * 100.0) / totalIdeas : 0;

               byDepartment.add(DepartmentBreakdownDto.builder()
                     .deptId(deptIdKey)
                     .deptName(dept.getDeptName())
                     .ideaCount(deptIdeas.size())
                     .commentCount((int) deptCommentCount)
                     .userCount((int) deptUserCount)
                     .percent(Math.round(percent * 100.0) / 100.0)
                     .build());
            }
         }
      });

      // Sort by idea count descending
      byDepartment.sort((a, b) -> Integer.compare(b.getIdeaCount(), a.getIdeaCount()));

      // Get top 5 contributors
      List<TopContributorDto> topContributors = ideas.stream()
            .filter(i -> i.getUser() != null)
            .collect(Collectors.groupingBy(i -> i.getUser().getUserId(),
                  Collectors.collectingAndThen(Collectors.toList(), list -> list)))
            .entrySet().stream()
            .map(entry -> {
               List<Idea> userIdeas = entry.getValue();
               return TopContributorDto.builder()
                     .userId(entry.getKey())
                     .fullName(
                           userIdeas.get(0).getUser() != null ? userIdeas.get(0).getUser().getFullName() : "Unknown")
                     .deptName(userIdeas.get(0).getDepartment() != null ? userIdeas.get(0).getDepartment().getDeptName()
                           : "")
                     .ideaCount(userIdeas.size())
                     .build();
            })
            .sorted((a, b) -> Integer.compare(b.getIdeaCount(), a.getIdeaCount()))
            .limit(5)
            .collect(Collectors.toList());

      // Calculate monthly trends
      Map<YearMonth, Integer> monthlyIdeas = ideas.stream()
            .filter(i -> i.getSubmittedAt() != null)
            .collect(Collectors.groupingBy(
                  i -> YearMonth.from(i.getSubmittedAt()),
                  Collectors.summingInt(i -> 1)));

      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yy");
      List<MonthlyTrendDto> monthlyTrend = monthlyIdeas.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .map(entry -> MonthlyTrendDto.builder()
                  .month(entry.getKey().format(formatter))
                  .ideaCount(entry.getValue())
                  .build())
            .collect(Collectors.toList());

      // Get department name if filtered by department
      String deptName = "";
      if (deptId != null) {
         Optional<Department> dept = departmentRepository.findById(deptId);
         deptName = dept.map(Department::getDeptName).orElse("");
      }

      Integer countOfDepartments = byDepartment.size();

      return ComprehensiveStatisticsResponse.builder()
            .totalIdeas(totalIdeas)
            .totalComments(totalComments)
            .totalUsers(totalUsers)
            .totalDepartments(countOfDepartments)
            .ideasThisYear(totalIdeas)
            .anonymousIdeas(anonymousIdeas)
            .ideasWithComments(ideasWithCommentsCount)
            .ideasWithoutComments(ideasWithoutCommentsCount)
            .deptName(deptName)
            .topContributors(topContributors)
            .byDepartment(byDepartment)
            .monthlyTrend(monthlyTrend)
            .build();
   }
}
