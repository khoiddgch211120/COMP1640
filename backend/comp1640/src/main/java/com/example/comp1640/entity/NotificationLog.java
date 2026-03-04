package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "recipient_user_id")
    private User recipientUser;

    @ManyToOne
    @JoinColumn(name = "idea_id")
    private Idea idea;

    @Column(name = "notif_type")
    private String notifType;

    private String status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;
}
