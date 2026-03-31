package com.example.comp1640.service;

import com.example.comp1640.dto.response.DashboardResponse;

public interface DashboardService {

    /**
     * @param deptId null = thống kê toàn trường, có giá trị = thống kê theo phòng ban
     */
    DashboardResponse getDashboard(Integer deptId);
}