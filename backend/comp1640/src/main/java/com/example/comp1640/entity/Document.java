import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer docId;

    @ManyToOne
    @JoinColumn(name = "idea_id")
    private Idea idea;

    private String fileName;

    private String filePath;

    private String fileType;

    private Integer fileSizeKb;

    private LocalDateTime uploadedAt;

}