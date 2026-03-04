package com.example.comp1640.repository;

import com.example.comp1640.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findByIdea_IdeaId(Integer ideaId);
    void deleteByIdea_IdeaId(Integer ideaId);
}

