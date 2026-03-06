package com.example.comp1640.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    private String content;
    private Boolean isAnonymous = false;
}
