package com.example.comp1640.controller;

import com.example.comp1640.dto.response.DashboardResponse;
import com.example.comp1640.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /dashboard           → thống kê toàn trường
     * GET /dashboard?dept_id=1 → thống kê theo phòng ban
     *
     * Response khớp với AdminDashboard.jsx:
     * {
     *   total_ideas, total_comments, total_users, total_departments,
     *   ideas_this_year, anonymous_ideas,
     *   ideas_with_comments, ideas_without_comments,
     *   dept_name (khi filter theo dept),
     *   monthly_trend: [{ month, idea_count }],
     *   top_contributors: [{ full_name, dept_name, idea_count, initial }],
     *   by_department: [{ dept_id, dept_name, idea_count, comment_count, user_count, percent }]
     * }
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardResponse> getDashboard(
            @RequestParam(required = false) Integer deptId) {
        return ResponseEntity.ok(dashboardService.getDashboard(deptId));
    }
}