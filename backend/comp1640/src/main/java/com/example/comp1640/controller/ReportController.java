package com.example.comp1640.controller;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.comp1640.dto.response.IdeaResponse;
import com.example.comp1640.dto.response.ReportStatsResponse;
import com.example.comp1640.service.ReportService;

@RestController
@RequestMapping("/reports")
@PreAuthorize("hasAnyRole('ADMIN', 'QA_MANAGER', 'DEPT_MANAGER', 'HR_MANAGER', 'QA_COORDINATOR')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ReportStatsResponse> getStats(
            @RequestParam(required = false) Integer yearId,
            @RequestParam(required = false) Integer deptId) {
        return ResponseEntity.ok(reportService.getStats(yearId, deptId));
    }

    @GetMapping("/no-comment")
    public ResponseEntity<List<IdeaResponse>> getNoCommentIdeas(
            @RequestParam(required = false) Integer yearId,
            @RequestParam(required = false) Integer deptId) {
        return ResponseEntity.ok(reportService.getNoCommentIdeas(yearId, deptId));
    }

    /** Xuất CSV danh sách ý tưởng (chỉ sau final_closure_date) */
    @GetMapping("/export/csv")
    
    public ResponseEntity<byte[]> exportCsv(@RequestParam Integer yearId) {
        byte[] csv = reportService.exportIdeasCsv(yearId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("ideas_year_" + yearId + ".csv")
                                .build().toString())
                .body(csv);
    }

    /** Xuất ZIP tài liệu đính kèm (chỉ sau final_closure_date) */
    @GetMapping("/export/zip")
    public ResponseEntity<byte[]> exportZip(@RequestParam Integer yearId) {
        byte[] zip = reportService.exportDocumentsZip(yearId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/zip"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("documents_year_" + yearId + ".zip")
                                .build().toString())
                .body(zip);
    }
    @GetMapping("/statistics")
    public ResponseEntity<List<StatisticsReportResponse>> getStatisticsReport(
            @RequestParam Integer yearId,
            @RequestParam(required = false) Integer deptId) {
        return ResponseEntity.ok(reportService.getStatisticsReport(yearId, deptId));
    }

    @GetMapping("/no-comments")
    public ResponseEntity<List<IdeaNoCommentResponse>> getIdeasWithoutComments(
            @RequestParam Integer yearId) {
        return ResponseEntity.ok(reportService.getIdeasWithoutComments(yearId));
    }

    @GetMapping("/anonymous-content")
    public ResponseEntity<List<AnonymousContentResponse>> getAnonymousContent(
            @RequestParam Integer yearId) {
        return ResponseEntity.ok(reportService.getAnonymousContent(yearId));
    }
}
