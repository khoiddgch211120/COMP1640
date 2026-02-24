import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "idea")
public class Idea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ideaId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "year_id")
    private AcademicYear academicYear;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Boolean isAnonymous;

    private Boolean isDisabled;

    private Integer viewCount;

    private Boolean termsAccepted;

    private LocalDateTime submittedAt;

    private LocalDateTime updatedAt;

}