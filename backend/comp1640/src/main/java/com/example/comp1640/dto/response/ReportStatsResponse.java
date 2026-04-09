package com.example.comp1640.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportStatsResponse {

    private long totalIdeas;
    private long totalComments;
    private long totalVotes;
    private long totalContributors;
    private long anonymousIdeas;
    private double anonymousRate;

    private List<DeptStats> ideaByDept;
    private List<CategoryStats> ideaByCategory;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeptStats {
        private String deptName;
        private long count;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStats {
        private String categoryName;
        private long count;
    }
}
