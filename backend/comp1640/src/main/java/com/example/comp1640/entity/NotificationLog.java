import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_log")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "recipient_user_id")
    private User recipientUser;

    @ManyToOne
    @JoinColumn(name = "idea_id")
    private Idea idea;

    private String notifType;

    private String status;

    private LocalDateTime sentAt;

}