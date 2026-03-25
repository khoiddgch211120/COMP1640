package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_terms_acceptance")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@IdClass(UserTermsAcceptance.UserTermsId.class)
public class UserTermsAcceptance {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tc_id")
    private TermsCondition termsCondition;

    @CreationTimestamp
    private LocalDateTime acceptedAt;

    // ── Composite Key class ──────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    @EqualsAndHashCode
    public static class UserTermsId implements Serializable {
        private Integer user;
        private Integer termsCondition;
    }
}
