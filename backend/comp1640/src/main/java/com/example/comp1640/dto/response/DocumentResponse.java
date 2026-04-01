package com.example.comp1640.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {

    private Integer docId;          // frontend dùng doc_id (không phải documentId)
    private Integer ideaId;
    private String ideaTitle;       // thêm — frontend hiển thị tên idea
    private String fileName;
    private String filePath;
    private String fileType;
    private Long fileSizeKb;        // thêm — frontend hiển thị kích thước
    private String uploaderName;    // thêm — frontend hiển thị tên người upload
    private Integer deptId;         // thêm — frontend dùng để filter theo phòng ban
    private LocalDateTime uploadedAt;
}