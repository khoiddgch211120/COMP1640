package com.example.comp1640.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprehensiveStatisticsResponse {
   private Integer totalIdeas;
   private Integer totalComments;
   private Integer totalUsers;
   private Integer totalDepartments;
   private Integer ideasThisYear;
   private Integer anonymousIdeas;
   private Integer ideasWithComments;
   private Integer ideasWithoutComments;
   private String deptName;
   private List<TopContributorDto> topContributors;
   private List<DepartmentBreakdownDto> byDepartment;
   private List<MonthlyTrendDto> monthlyTrend;
}
