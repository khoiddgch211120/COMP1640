package com.example.comp1640.service;

import com.example.comp1640.dto.*;
import com.example.comp1640.entity.*;
import com.example.comp1640.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;
    private final DocumentRepository documentRepository;
    private final VoteRepository voteRepository;

    public Page<IdeaDTO> getAllIdeas(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Idea> ideas = ideaRepository.findAllByOrderBySubmittedAtDesc(pageable);
        return ideas.map(this::convertToDTO);
    }

    public IdeaDTO getIdeaById(Integer id) {
        Idea idea = ideaRepository.findByIdeaId(id)
                .orElseThrow(() -> new RuntimeException("Idea not found with id: " + id));
        
        // Increment view count
        idea.setViewCount(idea.getViewCount() + 1);
        ideaRepository.save(idea);
        
        return convertToDTO(idea);
    }

    @Transactional
    public IdeaDTO createIdea(CreateIdeaRequest request, Integer userId, List<MultipartFile> files) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        AcademicYear academicYear = academicYearRepository.findById(request.getYearId())
                .orElseThrow(() -> new RuntimeException("Academic year not found with id: " + request.getYearId()));

        // Check if within closure date
        if (academicYear.getIdeaClosureDate() != null && 
            LocalDateTime.now().toLocalDate().isAfter(academicYear.getIdeaClosureDate())) {
            throw new RuntimeException("Cannot create idea after closure date");
        }

        Idea idea = new Idea();
        idea.setUser(user);
        idea.setAcademicYear(academicYear);
        idea.setTitle(request.getTitle());
        idea.setContent(request.getContent());
        idea.setIsAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false);
        idea.setIsDisabled(false);
        idea.setViewCount(0);
        idea.setTermsAccepted(request.getTermsAccepted() != null ? request.getTermsAccepted() : true);
        idea.setSubmittedAt(LocalDateTime.now());
        idea.setUpdatedAt(LocalDateTime.now());

        // Set categories
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            idea.setCategories(categories);
            
            // Mark categories as used
            for (Category category : categories) {
                category.setIsUsed(true);
                categoryRepository.save(category);
            }
        }

        Idea savedIdea = ideaRepository.save(idea);

        // Handle file uploads
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        saveDocument(savedIdea, file);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
                    }
                }
            }
        }

        return convertToDTO(savedIdea);
    }

    @Transactional
    public IdeaDTO updateIdea(Integer id, UpdateIdeaRequest request, Integer userId) {
        Idea idea = ideaRepository.findByIdeaId(id)
                .orElseThrow(() -> new RuntimeException("Idea not found with id: " + id));

        // Check if user is the author
        if (!idea.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You can only update your own ideas");
        }

        // Check if within closure date
        if (idea.getAcademicYear() != null && 
            idea.getAcademicYear().getIdeaClosureDate() != null && 
            LocalDateTime.now().toLocalDate().isAfter(idea.getAcademicYear().getIdeaClosureDate())) {
            throw new RuntimeException("Cannot update idea after closure date");
        }

        if (request.getTitle() != null) {
            idea.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            idea.setContent(request.getContent());
        }
        idea.setUpdatedAt(LocalDateTime.now());

        // Update categories if provided
        if (request.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            idea.setCategories(categories);
        }

        Idea savedIdea = ideaRepository.save(idea);
        return convertToDTO(savedIdea);
    }

    public List<IdeaDTO> getMostPopularIdeas(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return ideaRepository.findMostPopular(pageable)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<IdeaDTO> getMostViewedIdeas(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return ideaRepository.findTopByViewCount(pageable)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<IdeaDTO> getLatestIdeas(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return ideaRepository.findLatest(pageable)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void saveDocument(Idea idea, MultipartFile file) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/uploads";
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFilename = UUID.randomUUID().toString() + extension;
        
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);

        Document document = new Document();
        document.setIdea(idea);
        document.setFileName(originalFilename);
        document.setFilePath("/uploads/" + newFilename);
        document.setFileType(file.getContentType());
        document.setFileSizeKb((int) (file.getSize() / 1024));
        document.setUploadedAt(LocalDateTime.now());
        
        documentRepository.save(document);
    }

    private IdeaDTO convertToDTO(Idea idea) {
        IdeaDTO dto = new IdeaDTO();
        dto.setIdeaId(idea.getIdeaId());
        dto.setTitle(idea.getTitle());
        dto.setContent(idea.getContent());
        dto.setIsAnonymous(idea.getIsAnonymous());
        dto.setIsDisabled(idea.getIsDisabled());
        dto.setViewCount(idea.getViewCount());
        dto.setTermsAccepted(idea.getTermsAccepted());
        dto.setSubmittedAt(idea.getSubmittedAt());
        dto.setUpdatedAt(idea.getUpdatedAt());

        if (idea.getUser() != null) {
            dto.setUserId(idea.getUser().getUserId());
            dto.setAuthorName(idea.getIsAnonymous() ? "Anonymous" : idea.getUser().getFullName());
        }

        if (idea.getDepartment() != null) {
            dto.setDepartmentId(idea.getDepartment().getDeptId());
            dto.setDepartmentName(idea.getDepartment().getDeptName());
        }

        if (idea.getAcademicYear() != null) {
            dto.setYearId(idea.getAcademicYear().getYearId());
            dto.setYearLabel(idea.getAcademicYear().getYearLabel());
        }

        // Convert categories
        if (idea.getCategories() != null) {
            List<CategoryDTO> categoryDTOs = idea.getCategories().stream()
                    .map(cat -> {
                        CategoryDTO catDto = new CategoryDTO();
                        catDto.setCategoryId(cat.getCategoryId());
                        catDto.setCategoryName(cat.getCategoryName());
                        catDto.setDescription(cat.getDescription());
                        catDto.setIsUsed(cat.getIsUsed());
                        return catDto;
                    })
                    .collect(Collectors.toList());
            dto.setCategories(categoryDTOs);
        }

        // Convert documents
        if (idea.getDocuments() != null) {
            List<DocumentDTO> documentDTOs = idea.getDocuments().stream()
                    .map(doc -> {
                        DocumentDTO docDto = new DocumentDTO();
                        docDto.setDocId(doc.getDocId());
                        docDto.setFileName(doc.getFileName());
                        docDto.setFilePath(doc.getFilePath());
                        docDto.setFileType(doc.getFileType());
                        docDto.setFileSizeKb(doc.getFileSizeKb());
                        docDto.setUploadedAt(doc.getUploadedAt());
                        return docDto;
                    })
                    .collect(Collectors.toList());
            dto.setDocuments(documentDTOs);
        }

        // Get vote count
        Integer voteCount = voteRepository.getSumVoteTypeByIdeaId(idea.getIdeaId());
        dto.setVoteCount(voteCount != null ? voteCount : 0);

        return dto;
    }
}

