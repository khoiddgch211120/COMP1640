package com.example.comp1640.service;

import com.example.comp1640.dto.CategoryDTO;
import com.example.comp1640.entity.Category;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.CategoryRepository;
import com.example.comp1640.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllByOrderByCategoryIdDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return convertToDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto, Integer userId) {
        User createdBy = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Category category = new Category();
        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        category.setIsUsed(false);
        category.setCreatedBy(createdBy);
        category.setCreatedAt(LocalDateTime.now());

        Category saved = categoryRepository.save(category);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        if (category.getIsUsed() != null && category.getIsUsed()) {
            throw new RuntimeException("Cannot delete category that is currently in use");
        }

        categoryRepository.delete(category);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        dto.setDescription(category.getDescription());
        dto.setIsUsed(category.getIsUsed());
        dto.setCreatedAt(category.getCreatedAt());
        if (category.getCreatedBy() != null) {
            dto.setCreatedByName(category.getCreatedBy().getFullName());
        }
        return dto;
    }
}

