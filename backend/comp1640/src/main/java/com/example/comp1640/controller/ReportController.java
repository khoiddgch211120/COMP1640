package com.example.comp1640.controller;

import java.util.List;

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
@PreAuthorize("hasAnyRole('ADMIN', 'QA_MGR', 'QA_COORD')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Thống kê tổng hợp: số ideas, comments, votes, contributors, anonymous rate
    // ?yearId=1&deptId=2 (cả hai optional)
    @GetMapping("/stats")
    public ResponseEntity<ReportStatsResponse> getStats(
            @RequestParam(required = false) Integer yearId,
            @RequestParam(required = false) Integer deptId) {
        return ResponseEntity.ok(reportService.getStats(yearId, deptId));
    }

    // Danh sách ý tưởng chưa có comment nào
    @GetMapping("/no-comment")
    public ResponseEntity<List<IdeaResponse>> getNoCommentIdeas(
            @RequestParam(required = false) Integer yearId,
            @RequestParam(required = false) Integer deptId) {
        return ResponseEntity.ok(reportService.getNoCommentIdeas(yearId, deptId));
    }
}
