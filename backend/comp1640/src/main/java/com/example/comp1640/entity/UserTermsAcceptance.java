package com.example.comp1640.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_terms_acceptance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(UserTermsAcceptance.UserTermsId.class)
public class UserTermsAcceptance {

    @NotNull(message = "User không được phép null")
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull(message = "Terms không được phép null")
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tc_id")
    private TermsConditions termsCondition;

    @CreationTimestamp
    private LocalDateTime acceptedAt;

    // ── Composite Key class ──────────────────────────────────
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class UserTermsId implements Serializable {
        private Integer user;
        private Integer termsCondition;
    }
}
