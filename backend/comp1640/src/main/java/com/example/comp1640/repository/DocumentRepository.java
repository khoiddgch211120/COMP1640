package com.example.comp1640.repository;

import com.example.comp1640.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findByIdeaIdeaId(Integer ideaId);
}
