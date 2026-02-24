import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_terms_acceptance")
public class UserTermsAcceptance {

    @EmbeddedId
    private UserTermsKey id;

    private LocalDateTime acceptedAt;

}