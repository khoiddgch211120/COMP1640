package com.example.comp1640.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTermsKey implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "tc_id")
    private Integer tcId;
}

