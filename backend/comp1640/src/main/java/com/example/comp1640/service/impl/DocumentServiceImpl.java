package com.example.comp1640.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.comp1640.dto.response.DocumentResponse;
import com.example.comp1640.model.Document;
import com.example.comp1640.model.Idea;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.DocumentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final Cloudinary cloudinary;
    private final DocumentRepository documentRepository;
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;

    @Override
    public DocumentResponse upload(Integer ideaId, MultipartFile file) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        User currentUser = getCurrentUser();
        if (!idea.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("You can only upload files to your own idea");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "comp1640/ideas/" + ideaId,
                            "resource_type", "auto"));

            Document document = new Document();
            document.setIdea(idea);
            document.setFileName(file.getOriginalFilename());
            document.setFileUrl((String) uploadResult.get("secure_url"));
            document.setPublicId((String) uploadResult.get("public_id"));
            document.setFileType(file.getContentType());
            document.setUploadedAt(LocalDateTime.now());

            return toResponse(documentRepository.save(document));
        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    @Override
    public List<DocumentResponse> getByIdea(Integer ideaId) {
        return documentRepository.findByIdeaIdeaId(ideaId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public void delete(Integer documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRole() != null &&
                "ADMIN".equals(currentUser.getRole().getRoleName());

        if (!document.getIdea().getUser().getUserId().equals(currentUser.getUserId()) && !isAdmin) {
            throw new AccessDeniedException("You can only delete your own files");
        }

        try {
            cloudinary.uploader().destroy(document.getPublicId(), ObjectUtils.asMap("resource_type", "auto"));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from Cloudinary: " + e.getMessage());
        }

        documentRepository.delete(document);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private DocumentResponse toResponse(Document doc) {
        return new DocumentResponse(
                doc.getDocumentId(),
                doc.getIdea().getIdeaId(),
                doc.getFileName(),
                doc.getFileUrl(),
                doc.getFileType(),
                doc.getUploadedAt());
    }
}
