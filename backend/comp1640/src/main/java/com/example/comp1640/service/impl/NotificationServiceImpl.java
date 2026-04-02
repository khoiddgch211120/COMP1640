package com.example.comp1640.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.NotificationLog;
import com.example.comp1640.enums.NotifStatus;
import com.example.comp1640.enums.NotifType;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.NotificationLogRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.NotificationService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    private final NotificationLogRepository logRepo;
    private final UserRepository userRepo;

    @Value("${app.mail.from:noreply@comp1640.local}")
    private String fromEmail;

    public NotificationServiceImpl(NotificationLogRepository logRepo, UserRepository userRepo) {
        this.logRepo = logRepo;
        this.userRepo = userRepo;
    }

    /**
     * Gửi email đến tất cả QA_COORD trong cùng phòng ban khi có ý tưởng mới.
     * Chạy async để không block request chính.
     */
    @Override
    @Async
    public void notifyNewIdea(Idea idea) {
        if (idea.getDepartment() == null)
            return;

        Integer deptId = idea.getDepartment().getDeptId();
        List<User> qaCoords = userRepo.findByDepartment_DeptId(deptId)
                .stream()
                .filter(u -> u.getRole() != null && "QA_COORD".equals(u.getRole().getRoleName()))
                .toList();

        for (User recipient : qaCoords) {
            sendAndLog(
                    recipient,
                    idea,
                    NotifType.NEW_IDEA,
                    "Ý tưởng mới trong phòng ban của bạn",
                    "Xin chào " + recipient.getFullName() + ",\n\n"
                            + "Có một ý tưởng mới được gửi trong phòng ban của bạn:\n"
                            + "Tiêu đề: " + idea.getTitle() + "\n"
                            + "Phòng ban: " + idea.getDepartment().getDeptName() + "\n\n"
                            + "Hệ thống COMP1640");
        }
    }

    /**
     * Gửi email đến chủ ý tưởng khi có comment mới (trừ khi chính họ comment).
     * Chạy async để không block request chính.
     */
    @Override
    @Async
    public void notifyNewComment(Comment comment) {
        User ideaOwner = comment.getIdea().getUser();
        // Không gửi email nếu chính chủ idea là người comment
        if (ideaOwner.getUserId().equals(comment.getUser().getUserId()))
            return;

        String commenterName = Boolean.TRUE.equals(comment.getIsAnonymous())
                ? "Ẩn danh"
                : comment.getUser().getFullName();

        sendAndLog(
                ideaOwner,
                comment.getIdea(),
                NotifType.NEW_COMMENT,
                "Ý tưởng của bạn có bình luận mới",
                "Xin chào " + ideaOwner.getFullName() + ",\n\n"
                        + "Ý tưởng \"" + comment.getIdea().getTitle() + "\" của bạn vừa nhận được bình luận mới từ "
                        + commenterName + ".\n\n"
                        + "Hệ thống COMP1640");
    }

    // --- helper ---

    private void sendAndLog(User recipient, Idea idea, NotifType type, String subject, String body) {
        NotificationLog logEntry = new NotificationLog();
        logEntry.setRecipient(recipient);
        logEntry.setIdea(idea);
        logEntry.setNotifType(type);
        logEntry.setSentAt(LocalDateTime.now());

        if (mailSender == null) {
            logEntry.setStatus(NotifStatus.FAILED);
            log.info("[Mail disabled] Would notify {} about {}", recipient.getEmail(), type);
            logRepo.save(logEntry);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipient.getEmail());
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);

            logEntry.setStatus(NotifStatus.SENT);
            log.info("Email sent to {} for {}", recipient.getEmail(), type);
        } catch (MailException e) {
            logEntry.setStatus(NotifStatus.FAILED);
            log.warn("Failed to send email to {}: {}", recipient.getEmail(), e.getMessage());
        }

        logRepo.save(logEntry);
    }
}
