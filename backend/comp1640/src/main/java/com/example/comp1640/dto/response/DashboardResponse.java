package com.example.comp1640.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    // KPI cards
    private Integer totalIdeas;
    private Integer totalComments;
    private Integer totalUsers;
    private Integer totalDepartments;   // chỉ có khi overall
    private Integer ideasThisYear;
    private Integer anonymousIdeas;
    private Integer ideasWithComments;
    private Integer ideasWithoutComments;

    // Khi filter theo dept — hiển thị tên dept trong badge
    private String deptName;

    // Biểu đồ trend 8 tháng gần nhất
    private List<MonthlyTrend> monthlyTrend;

    // Top contributors
    private List<TopContributor> topContributors;

    // Chỉ có khi overall — bảng breakdown theo dept
    private List<DeptBreakdown> byDepartment;

    // ── Inner classes ──

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class MonthlyTrend {
        private String month;       // "Jan 25", "Feb 25"...
        private Integer ideaCount;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class TopContributor {
        private String fullName;
        private String deptName;    // null khi đang ở view dept
        private Integer ideaCount;
        private String initial;     // chữ cái đầu của fullName để hiển thị avatar
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class DeptBreakdown {
        private Integer deptId;
        private String deptName;
        private Integer ideaCount;
        private Integer commentCount;
        private Integer userCount;
        private Integer percent;    // % so với tổng ideas
    }
}