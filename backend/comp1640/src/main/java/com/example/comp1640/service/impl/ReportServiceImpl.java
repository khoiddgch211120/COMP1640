package com.example.comp1640.service.impl;

import com.example.comp1640.dto.response.AnonymousContentResponse;
import com.example.comp1640.dto.response.IdeaNoCommentResponse;
import com.example.comp1640.dto.response.StatisticsReportResponse;
import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.Department;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.DepartmentRepository;
import com.example.comp1640.repository.IdeaRepository;
import org.springframework.stereotype.Service;

import com.example.comp1640.service.ReportService;
import java.util.*;
import java.util.stream.Collectors;

@Service
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
      List<Idea> ideas = deptId != null
            ? ideaRepository.findByAcademicYear_YearIdAndDepartment_DeptId(yearId, deptId)
            : ideaRepository.findByAcademicYear_YearId(yearId);

      long totalIdeas = ideas.size();
      if (totalIdeas == 0) {
         return new ArrayList<>();
      }

      // Group ideas by department
      Map<Integer, List<Idea>> ideaByDept = ideas.stream()
            .collect(Collectors.groupingBy(i -> i.getDepartment().getDeptId()));

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
                     .map(idea -> idea.getUser().getUserId())
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
      List<Idea> ideasWithoutComments = ideaRepository.findIdeasWithoutComments(yearId);

      return ideasWithoutComments.stream()
            .map(idea -> IdeaNoCommentResponse.from(idea))
            .collect(Collectors.toList());
   }

   @Override
   public List<AnonymousContentResponse> getAnonymousContent(Integer yearId) {
      List<AnonymousContentResponse> anonymousContents = new ArrayList<>();

      // Get anonymous ideas
      List<Idea> anonymousIdeas = ideaRepository.findAnonymousIdeas(yearId);
      anonymousIdeas.forEach(idea -> {
         anonymousContents.add(AnonymousContentResponse.builder()
               .contentType("IDEA")
               .contentId(idea.getIdeaId())
               .contentPreview(idea.getTitle().substring(0, Math.min(100, idea.getTitle().length())))
               .authorRealName(idea.getUser().getFullName())
               .isAnonymous(true)
               .createdAt(idea.getSubmittedAt())
               .build());
      });

      // Get anonymous comments
      List<Comment> anonymousComments = commentRepository.findAnonymousCommentsByYear(yearId);
      anonymousComments.forEach(comment -> {
         anonymousContents.add(AnonymousContentResponse.builder()
               .contentType("COMMENT")
               .contentId(comment.getCommentId())
               .contentPreview(comment.getContent().substring(0, Math.min(100, comment.getContent().length())))
               .authorRealName(comment.getUser().getFullName())
               .isAnonymous(true)
               .createdAt(comment.getCreatedAt())
               .build());
      });

      // Sort by createdAt descending
      anonymousContents.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

      return anonymousContents;
   }
}
