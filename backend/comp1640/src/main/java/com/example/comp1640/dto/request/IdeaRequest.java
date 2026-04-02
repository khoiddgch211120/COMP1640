package com.example.comp1640.dto.request;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeaRequest {

    private Integer yearId;
    private String title;
    private String content;
    private Boolean isAnonymous = false;
    private Boolean termsAccepted = false;
    private Set<Integer> categoryIds;
}
