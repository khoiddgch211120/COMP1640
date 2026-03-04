package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vote", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "idea_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_id")
    private Integer voteId;

    @ManyToOne
    @JoinColumn(name = "idea_id")
    private Idea idea;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "vote_type")
    private Integer voteType;

    @Column(name = "voted_at")
    private LocalDateTime votedAt;
}
