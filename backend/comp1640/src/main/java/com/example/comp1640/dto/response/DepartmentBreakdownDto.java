package com.example.comp1640.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentBreakdownDto {
   private Integer deptId;
   private String deptName;
   private Integer ideaCount;
   private Integer commentCount;
   private Integer userCount;
   private Double percent;
}
