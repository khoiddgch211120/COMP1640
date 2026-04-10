package com.example.comp1640.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "blacklisted_tokens")
@Getter
@Setter
@NoArgsConstructor
public class BlacklistedToken {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(name = "token", nullable = false, length = 2048, unique = true)
   private String token;

   @Column(name = "expires_at", nullable = false)
   private LocalDateTime expiresAt;

   public BlacklistedToken(String token, LocalDateTime expiresAt) {
      this.token = token;
      this.expiresAt = expiresAt;
   }
}
