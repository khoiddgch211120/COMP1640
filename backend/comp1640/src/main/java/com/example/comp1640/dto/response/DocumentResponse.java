package com.example.comp1640.dto.response;
import com.example.comp1640.entity.Document;
import java.time.LocalDateTime;

public record DocumentResponse(Integer docId,
                                Integer ideaId,
                                String fileName,
                                String fileType,
                                Integer fileSizeKb,
                                LocalDateTime uploadedAt) {
    public static DocumentResponse from(Document d) {
        return new DocumentResponse(d.getDocId(),
                                    d.getIdea().getIdeaId(),
                                    d.getFileName(),
                                    d.getFileType(),
                                    d.getFileSizeKb(),
                                    d.getUploadedAt());
    }
}
