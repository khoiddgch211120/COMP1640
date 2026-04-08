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
public class TopContributorDto {
   private Integer userId;
   private String fullName;
   private String deptName;
   private Integer ideaCount;
}
