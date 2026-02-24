import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "terms_condition")
public class TermsCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tcId;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer version;

    private LocalDate effectiveDate;

    private LocalDateTime createdAt;

}