package com.example.comp1640.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private Integer docId;
    private String fileName;
    private String filePath;
    private String fileType;
    private Integer fileSizeKb;
    private LocalDateTime uploadedAt;
}

