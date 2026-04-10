package com.example.comp1640.security;

import com.example.comp1640.entity.BlacklistedToken;
import com.example.comp1640.repository.BlacklistedTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class TokenBlacklistService {

    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public TokenBlacklistService(BlacklistedTokenRepository blacklistedTokenRepository,
            JwtTokenUtil jwtTokenUtil) {
        this.blacklistedTokenRepository = blacklistedTokenRepository;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Transactional
    public void blacklist(String token) {
        if (!blacklistedTokenRepository.existsByToken(token)) {
            Date expiry = jwtTokenUtil.getExpirationFromToken(token);
            LocalDateTime expiresAt = expiry.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            blacklistedTokenRepository.save(new BlacklistedToken(token, expiresAt));
        }
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }

    // Dọn dẹp các token đã hết hạn mỗi giờ
    @Scheduled(fixedRate = 3_600_000)
    @Transactional
    public void purgeExpiredTokens() {
        blacklistedTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
