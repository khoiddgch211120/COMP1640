package com.example.comp1640.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_terms_acceptance")
@Getter
@Setter
@NoArgsConstructor
public class UserTermsAcceptance {

    @EmbeddedId
    private UserTermsAcceptanceId id = new UserTermsAcceptanceId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("tcId")
    @JoinColumn(name = "tc_id")
    private TermsConditions termsConditions;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    public UserTermsAcceptance(User user, TermsConditions termsConditions, LocalDateTime acceptedAt) {
        this.user = user;
        this.termsConditions = termsConditions;
        this.acceptedAt = acceptedAt;
        this.id = new UserTermsAcceptanceId(user.getUserId(), termsConditions.getTermsId());
    }
}
