package com.example.comp1640.entity;

import com.example.comp1640.enums.NotifStatus;
import com.example.comp1640.enums.NotifType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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
    private Integer logId;

    @NotNull(message = "Người nhận không được phép null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipient;

    @NotNull(message = "Idea không được phép null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id", nullable = false)
    private Idea idea;

    @NotNull(message = "Loại thông báo không được phép null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotifType notifType;

    @NotNull(message = "Trạng thái không được phép null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private NotifStatus status = NotifStatus.SENT;

    @CreationTimestamp
    private LocalDateTime sentAt;
}
