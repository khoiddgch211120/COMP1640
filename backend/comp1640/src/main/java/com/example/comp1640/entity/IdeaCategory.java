package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "idea_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(IdeaCategoryKey.class)
public class IdeaCategory {

    @Id
    @Column(name = "idea_id")
    private Integer ideaId;

    @Id
    @Column(name = "category_id")
    private Integer categoryId;

    @ManyToOne
    @JoinColumn(name = "idea_id", insertable = false, updatable = false)
    private Idea idea;

    @ManyToOne
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;
}

