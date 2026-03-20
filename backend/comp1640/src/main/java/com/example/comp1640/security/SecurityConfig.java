package com.example.comp1640.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Swagger UI
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // Auth endpoints
                        .requestMatchers("/auth/**").permitAll()

                        // Public GET endpoints (không cần đăng nhập theo SRS section 3.1)
                        .requestMatchers(HttpMethod.GET,
                                "/ideas", "/ideas/most-popular", "/ideas/most-viewed", "/ideas/latest",
                                "/ideas/*",
                                "/ideas/*/comments", "/comments/latest",
                                "/ideas/*/documents",
                                "/ideas/*/vote",
                                "/categories",
                                "/departments",
                                "/terms"
                        ).permitAll()

                        // Reports chỉ dành cho ADMIN, QA_MGR, QA_COORD (xử lý bằng @PreAuthorize)
                        .requestMatchers("/reports/**").authenticated()

                        // Tất cả request còn lại phải xác thực
                        .anyRequest().authenticated())
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
