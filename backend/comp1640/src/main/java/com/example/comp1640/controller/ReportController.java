package com.example.comp1640.controller;

import com.example.comp1640.dto.response.AnonymousContentResponse;
import com.example.comp1640.dto.response.IdeaNoCommentResponse;
import com.example.comp1640.dto.response.StatisticsReportResponse;
import com.example.comp1640.service.ExportService;
import com.example.comp1640.service.ReportService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

   private final ReportService reportService;
   private final ExportService exportService;

   public ReportController(ReportService reportService, ExportService exportService) {
      this.reportService = reportService;
      this.exportService = exportService;
   }

   /**
    * Get statistics report for all departments in a specific academic year
    * Accessible by: ADMIN, QA_MANAGER, DEPT_MANAGER, HR_MANAGER, QA_COORDINATOR
    */
   @GetMapping("/statistics")
   @PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER', 'DEPT_MANAGER', 'HR_MANAGER', 'QA_COORDINATOR')")
   public ResponseEntity<List<StatisticsReportResponse>> getStatisticsReport(
         @RequestParam Integer yearId,
         @RequestParam(required = false) Integer deptId) {
      return ResponseEntity.ok(reportService.getStatisticsReport(yearId, deptId));
   }

   /**
    * Get list of ideas without any comments
    * Accessible by: ADMIN, QA_MANAGER, DEPT_MANAGER, HR_MANAGER, QA_COORDINATOR
    */
   @GetMapping("/no-comments")
   @PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER', 'DEPT_MANAGER', 'HR_MANAGER', 'QA_COORDINATOR')")
   public ResponseEntity<List<IdeaNoCommentResponse>> getIdeasWithoutComments(
         @RequestParam Integer yearId) {
      return ResponseEntity.ok(reportService.getIdeasWithoutComments(yearId));
   }

   /**
    * Get list of anonymous ideas and comments with author information
    * Accessible by: ADMIN, QA_MANAGER, DEPT_MANAGER, HR_MANAGER, QA_COORDINATOR
    */
   @GetMapping("/anonymous-content")
   @PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER', 'DEPT_MANAGER', 'HR_MANAGER', 'QA_COORDINATOR')")
   public ResponseEntity<List<AnonymousContentResponse>> getAnonymousContent(
         @RequestParam Integer yearId) {
      return ResponseEntity.ok(reportService.getAnonymousContent(yearId));
   }

   /**
    * Export all ideas and comments to CSV format
    * Accessible by: ADMIN, QA_MANAGER, DEPT_MANAGER, HR_MANAGER, QA_COORDINATOR
    * Only available after final_closure_date
    */
   @GetMapping("/export/csv")
   @PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER', 'DEPT_MANAGER', 'HR_MANAGER', 'QA_COORDINATOR')")
   public void exportToCSV(
         @RequestParam Integer yearId,
         HttpServletResponse response) {
      exportService.exportIdeasAndCommentsToCSV(yearId, response);
   }

   /**
    * Export all attachments as ZIP file
    * Accessible by: ADMIN, QA_MANAGER, DEPT_MANAGER, HR_MANAGER, QA_COORDINATOR
    * Only available after final_closure_date
    */
   @GetMapping("/export/attachments-zip")
   @PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER', 'DEPT_MANAGER', 'HR_MANAGER', 'QA_COORDINATOR')")
   public void exportAttachmentsAsZip(
         @RequestParam Integer yearId,
         HttpServletResponse response) {
      exportService.exportAttachmentsAsZip(yearId, response);
   }
}
