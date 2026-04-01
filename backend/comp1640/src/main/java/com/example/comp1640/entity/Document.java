package com.example.comp1640.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "document")
@Getter
@Setter
@NoArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Integer documentId;

    @NotNull(message = "Idea không được phép null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id", nullable = false)
    private Idea idea;

    @NotBlank(message = "Tên tệp không được để trống")
    @Size(max = 255, message = "Tên tệp không được vượt quá 255 ký tự")
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @NotBlank(message = "URL tệp không được để trống")
    @Size(max = 1000, message = "URL tệp không được vượt quá 1000 ký tự")
    @Column(name = "file_url", nullable = false, length = 1000)
    private String fileUrl;

    @NotBlank(message = "Public ID không được để trống")
    @Column(name = "public_id", nullable = false)
    private String publicId;

    @Size(max = 50, message = "Loại tệp không được vượt quá 50 ký tự")
    @Column(name = "file_type")
    private String fileType;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
}
