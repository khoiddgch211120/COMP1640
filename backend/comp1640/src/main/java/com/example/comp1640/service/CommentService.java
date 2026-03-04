package com.example.comp1640.service;

import com.example.comp1640.dto.request.CommentRequest;
import com.example.comp1640.dto.response.CommentResponse;

import java.util.List;

public interface CommentService {
    CommentResponse add(Integer ideaId, CommentRequest request);
    List<CommentResponse> getByIdea(Integer ideaId);
    CommentResponse update(Integer commentId, CommentRequest request);
    void delete(Integer commentId);
}
