package com.example.comp1640.service;

import com.example.comp1640.dto.response.DocumentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    DocumentResponse upload(Integer ideaId, MultipartFile file);
    List<DocumentResponse> getByIdea(Integer ideaId);
    void delete(Integer documentId);
}
