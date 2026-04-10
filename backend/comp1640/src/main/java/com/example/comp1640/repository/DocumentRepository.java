package com.example.comp1640.repository;

import com.example.comp1640.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findByIdeaIdeaId(Integer ideaId);

    @Modifying
    @Query("DELETE FROM Document d WHERE d.idea.user.userId = :userId")
    void deleteByIdeaAuthorUserId(@Param("userId") Integer userId);
}
