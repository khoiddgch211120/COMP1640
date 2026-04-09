package com.example.comp1640.service;

import com.example.comp1640.dto.response.NotificationEventDto;
import com.example.comp1640.enums.NotifType;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.User;

public interface NotificationService {

   /**
    * Gửi thông báo khi có ý tưởng mới được nộp cho QA Coordinator của phòng ban
    */
   void notifyNewIdeaToCoordinators(Idea idea);

   /**
    * Gửi thông báo cho tác giả ý tưởng khi có bình luận mới
    */
   void notifyCommentToIdeaAuthor(Comment comment);
}
