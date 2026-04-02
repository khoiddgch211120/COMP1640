package com.example.comp1640.entity;

import com.example.comp1640.enums.NotifStatus;
import com.example.comp1640.enums.NotifType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id")
    private Idea idea;

    @Enumerated(EnumType.STRING)
    @Column(name = "notif_type", length = 20)
    private NotifType notifType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10)
    private NotifStatus status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;
}
