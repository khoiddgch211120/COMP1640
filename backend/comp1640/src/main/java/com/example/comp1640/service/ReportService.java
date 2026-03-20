package com.example.comp1640.service;

import java.util.List;

import com.example.comp1640.dto.response.IdeaResponse;
import com.example.comp1640.dto.response.ReportStatsResponse;

public interface ReportService {

    ReportStatsResponse getStats(Integer yearId, Integer deptId);

    List<IdeaResponse> getNoCommentIdeas(Integer yearId, Integer deptId);
}
