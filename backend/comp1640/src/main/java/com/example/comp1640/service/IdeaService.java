package com.example.comp1640.service;

import java.util.List;

import com.example.comp1640.dto.request.IdeaRequest;
import com.example.comp1640.dto.response.IdeaResponse;

public interface IdeaService {

    IdeaResponse submit(IdeaRequest request);

    List<IdeaResponse> getAll(Integer yearId, Integer deptId);

    IdeaResponse getById(Integer id);

    IdeaResponse update(Integer id, IdeaRequest request);

    void delete(Integer id);

    List<IdeaResponse> getMostViewed(Integer yearId);
}
