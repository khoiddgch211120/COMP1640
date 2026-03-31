package com.example.comp1640.service;

import com.example.comp1640.model.Comment;
import com.example.comp1640.model.Idea;

public interface NotificationService {

    /** Gửi email thông báo ý tưởng mới đến QA_COORD của phòng ban */
    void notifyNewIdea(Idea idea);

    /** Gửi email thông báo comment mới đến chủ ý tưởng */
    void notifyNewComment(Comment comment);
}
