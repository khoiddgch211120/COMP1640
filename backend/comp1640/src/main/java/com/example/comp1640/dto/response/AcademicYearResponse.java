package com.example.comp1640.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AcademicYearResponse {

    private Integer yearId;
    private String yearLabel;
    private LocalDate ideaClosureDate;
    private LocalDate finalClosureDate;
    private Integer createdBy;         // user_id của người tạo (frontend dùng created_by số)
    private String createdByName;
    private LocalDateTime createdAt;

    // Trạng thái tính theo ngày hiện tại
    private boolean ideaOpen;      // còn hạn nộp ý tưởng
    private boolean commentOpen;   // còn hạn bình luận

    // "active" | "upcoming" | "closed" — frontend dùng để hiển thị badge
    private String status;
}