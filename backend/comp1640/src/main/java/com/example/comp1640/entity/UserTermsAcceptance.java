package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_terms_acceptance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTermsAcceptance {

    @EmbeddedId
    private UserTermsAcceptanceId id;

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
}
