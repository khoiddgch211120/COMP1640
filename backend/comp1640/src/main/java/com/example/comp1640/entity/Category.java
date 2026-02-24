import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private String categoryName;

    private String description;

    private Boolean isUsed;

    private LocalDateTime createdAt;

}