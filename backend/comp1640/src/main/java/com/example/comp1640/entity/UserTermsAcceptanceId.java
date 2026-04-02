package com.example.comp1640.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserTermsAcceptanceId implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "tc_id")
    private Integer tcId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserTermsAcceptanceId)) return false;
        UserTermsAcceptanceId that = (UserTermsAcceptanceId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(tcId, that.tcId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, tcId);
    }
}
