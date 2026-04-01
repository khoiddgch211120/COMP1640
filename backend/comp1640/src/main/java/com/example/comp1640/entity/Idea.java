package com.example.comp1640.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "idea")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Idea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idea_id")
    private Integer ideaId;

    @NotNull(message = "User không được phép null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id")
    private Department department;

    @NotNull(message = "Academic Year không được phép null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "year_id", nullable = false)
    private AcademicYear academicYear;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "idea_category", joinColumns = @JoinColumn(name = "idea_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    @Default
    private Set<Category> categories = new HashSet<>();

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(min = 5, max = 500, message = "Tiêu đề phải từ 5 đến 500 ký tự")
    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Size(max = 5000, message = "Nội dung không được vượt quá 5000 ký tự")
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @NotNull(message = "Is Anonymous không được phép null")
    @Column(name = "is_anonymous")
    @Default
    private Boolean isAnonymous = false;

    @NotNull(message = "Is Disabled không được phép null")
    @Column(name = "is_disabled")
    @Default
    private Boolean isDisabled = false;

    @NotNull(message = "View count không được phép null")
    @Min(value = 0, message = "View count phải >= 0")
    @Column(name = "view_count")
    @Default
    private Integer viewCount = 0;

    @NotNull(message = "Terms accepted không được phép null")
    @Column(name = "terms_accepted")
    @Default
    private Boolean termsAccepted = false;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}