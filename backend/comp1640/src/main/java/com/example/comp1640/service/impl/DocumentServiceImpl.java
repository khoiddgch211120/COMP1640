package com.example.comp1640.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.comp1640.dto.response.DocumentResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.entity.Document;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.User;
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

    @Override
    public List<DocumentResponse> getAll() {
        return documentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private final Cloudinary cloudinary;
    private final DocumentRepository documentRepository;
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;

    @Override
    public DocumentResponse upload(Integer ideaId, MultipartFile file) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ý tưởng với id: " + ideaId));

        // Chỉ chủ idea mới được upload file
        User currentUser = getCurrentUser();
        if (!idea.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn chỉ được upload file cho ý tưởng của mình");
        }

        try {
            // Upload lên Cloudinary, lưu vào folder theo ideaId
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
            document.setFileSizeKb((file.getSize() + 1023) / 1024);
            document.setUploadedAt(LocalDateTime.now());

            return toResponse(documentRepository.save(document));
        } catch (IOException e) {
            throw new BadRequestException("Upload file thất bại: " + e.getMessage());
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
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy file với id: " + documentId));

        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRole() != null &&
                "ADMIN".equals(currentUser.getRole().getRoleName());

        // ADMIN hoặc chủ idea mới được xóa file
        if (!document.getIdea().getUser().getUserId().equals(currentUser.getUserId()) && !isAdmin) {
            throw new AccessDeniedException("Bạn chỉ được xóa file của ý tưởng mình");
        }

        try {
            // Xóa file khỏi Cloudinary theo public_id
            cloudinary.uploader().destroy(document.getPublicId(),
                    ObjectUtils.asMap("resource_type", "auto"));
        } catch (IOException e) {
            throw new BadRequestException("Xóa file trên Cloudinary thất bại: " + e.getMessage());
        }

        documentRepository.delete(document);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user hiện tại"));
    }

    private DocumentResponse toResponse(Document doc) {
        Idea idea = doc.getIdea();
        return new DocumentResponse(
                doc.getDocumentId(),
                idea.getIdeaId(),
                doc.getFileName(),
                doc.getFileUrl(),
                doc.getFileType(),
                doc.getFileSizeKb().intValue(),
                doc.getUploadedAt());
    }
}
