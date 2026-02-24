import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer deptId;

    private String deptName;

    private String deptType;

    private LocalDateTime createdAt;

}