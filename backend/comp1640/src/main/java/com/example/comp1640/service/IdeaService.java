package com.example.comp1640.service;

import com.example.comp1640.dto.request.IdeaRequest;
import com.example.comp1640.dto.response.IdeaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IdeaService {

    IdeaResponse submit(IdeaRequest request);

    /** Danh sách idea có lọc theo năm học/phòng ban, hỗ trợ phân trang */
    Page<IdeaResponse> getAll(Integer yearId, Integer deptId, Pageable pageable);

    IdeaResponse getById(Integer id);

    IdeaResponse update(Integer id, IdeaRequest request);

    void delete(Integer id);

    /** Ý tưởng xem nhiều nhất theo năm học */
    List<IdeaResponse> getMostViewed(Integer yearId);

    /** Ý tưởng phổ biến nhất (view_count DESC, sau này thay bằng vote score) */
    Page<IdeaResponse> getMostPopular(Pageable pageable);

    /** Ý tưởng mới nhất theo submitted_at DESC */
    Page<IdeaResponse> getLatest(Pageable pageable);
}
