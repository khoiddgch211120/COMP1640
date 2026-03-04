package com.example.comp1640.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeaCategoryKey implements Serializable {

   @Column(name = "idea_id")
   private Integer ideaId;

   @Column(name = "category_id")
   private Integer categoryId;
}
