package com.example.comp1640.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.comp1640.dto.request.CategoryRequest;
import com.example.comp1640.dto.response.CategoryResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.model.Category;
import com.example.comp1640.model.User;
import com.example.comp1640.repository.CategoryRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepo;
    private final UserRepository userRepo;

    public CategoryServiceImpl(CategoryRepository categoryRepo, UserRepository userRepo) {
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        if (request.getCategoryName() == null || request.getCategoryName().isBlank()) {
            throw new BadRequestException("Tên danh mục không được để trống");
        }
        if (categoryRepo.existsByCategoryName(request.getCategoryName())) {
            throw new BadRequestException("Tên danh mục đã tồn tại");
        }

        User currentUser = getCurrentUser();

        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());
        category.setCreatedBy(currentUser);
        category.setIsUsed(false);
        category.setCreatedAt(LocalDateTime.now());

        return toResponse(categoryRepo.save(category));
    }

    @Override
    public List<CategoryResponse> getAll() {
        return categoryRepo.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getById(Integer id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    public CategoryResponse update(Integer id, CategoryRequest request) {
        Category category = findOrThrow(id);

        if (request.getCategoryName() != null && !request.getCategoryName().isBlank()) {
            if (!request.getCategoryName().equals(category.getCategoryName())
                    && categoryRepo.existsByCategoryName(request.getCategoryName())) {
                throw new BadRequestException("Tên danh mục đã tồn tại");
            }
            category.setCategoryName(request.getCategoryName());
        }
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }

        return toResponse(categoryRepo.save(category));
    }

    @Override
    public void delete(Integer id) {
        Category category = findOrThrow(id);
        if (Boolean.TRUE.equals(category.getIsUsed())) {
            throw new BadRequestException("Không thể xóa danh mục đang được sử dụng");
        }
        categoryRepo.deleteById(id);
    }

    // --- helpers ---

    private Category findOrThrow(Integer id) {
        return categoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + id));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user hiện tại"));
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(
                c.getCategoryId(),
                c.getCategoryName(),
                c.getDescription(),
                c.getIsUsed(),
                c.getCreatedBy() != null ? c.getCreatedBy().getFullName() : null,
                c.getCreatedAt()
        );
    }
}
