package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_terms_acceptance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTermsAcceptance {

    @EmbeddedId
    private UserTermsKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("tcId")
    @JoinColumn(name = "tc_id")
    private TermsCondition termsCondition;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;
}
