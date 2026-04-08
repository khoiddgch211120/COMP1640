package com.example.comp1640.service;

import com.example.comp1640.dto.response.AnonymousContentResponse;
import com.example.comp1640.dto.response.IdeaNoCommentResponse;
import com.example.comp1640.dto.response.StatisticsReportResponse;
import com.example.comp1640.dto.response.ComprehensiveStatisticsResponse;

import java.util.List;

public interface ReportService {

   /**
    * Get statistics report for all departments in a specific academic year
    * 
    * @param yearId The academic year ID
    * @param deptId Optional department filter
    * @return List of statistics
    */
   List<StatisticsReportResponse> getStatisticsReport(Integer yearId, Integer deptId);

   /**
    * Get list of ideas without any comments for a specific academic year
    * 
    * @param yearId The academic year ID
    * @return List of ideas without comments
    */
   List<IdeaNoCommentResponse> getIdeasWithoutComments(Integer yearId);

   /**
    * Get list of anonymous ideas and comments with author information
    * 
    * @param yearId The academic year ID
    * @return List of anonymous content with author details
    */
   List<AnonymousContentResponse> getAnonymousContent(Integer yearId);

   /**
    * Get comprehensive statistics for dashboard
    * 
    * @param yearId The academic year ID
    * @param deptId Optional department filter
    * @return Comprehensive statistics including totals, trends, contributors, and
    *         breakdown
    */
   ComprehensiveStatisticsResponse getComprehensiveStatistics(Integer yearId, Integer deptId);
}
