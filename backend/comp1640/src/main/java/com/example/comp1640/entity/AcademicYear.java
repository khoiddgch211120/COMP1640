import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "academic_year")
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer yearId;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private String yearLabel;

    private LocalDate ideaClosureDate;

    private LocalDate finalClosureDate;

    private LocalDateTime createdAt;

}