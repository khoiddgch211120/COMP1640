package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "vote",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "idea_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer voteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id", nullable = false)
    private Idea idea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * +1 = Thumbs Up
     * -1 = Thumbs Down
     */
    @Column(nullable = false)
    private Integer voteType;

    @CreationTimestamp
    private LocalDateTime votedAt;
}
