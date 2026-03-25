package com.example.comp1640.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class StatisticsReportResponse {
   private Integer deptId;
   private String deptName;
   private Integer ideaCount;
   private Double percentageOfTotal;
   private Integer contributorCount;
}
