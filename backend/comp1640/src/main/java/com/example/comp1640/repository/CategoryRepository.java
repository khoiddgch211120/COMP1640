package com.example.comp1640.repository;

import com.example.comp1640.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    boolean existsByCategoryName(String categoryName);
}
