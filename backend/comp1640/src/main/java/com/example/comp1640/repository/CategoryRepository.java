package com.example.comp1640.repository;

import com.example.comp1640.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
   List<Category> findAllByOrderByCategoryIdDesc();

   boolean existsByCategoryIdAndIsUsedTrue(Integer categoryId);
}
