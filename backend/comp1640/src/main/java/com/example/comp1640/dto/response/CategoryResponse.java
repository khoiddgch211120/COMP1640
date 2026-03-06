package com.example.comp1640.dto.response;
import com.example.comp1640.entity.Category;
public record CategoryResponse(Integer categoryId, String categoryName, String description, Boolean isUsed) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(c.getCategoryId(), c.getCategoryName(), c.getDescription(), c.getIsUsed());
    }
}
