package com.example.comp1640.dto.request;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeaRequest {

    @NotNull(message = "yearId không được để trống")
    private Integer yearId;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    private Boolean isAnonymous = false;
    private Boolean termsAccepted = false;
    private Set<Integer> categoryIds;
}
