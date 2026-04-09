package com.example.comp1640.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import java.security.Principal;
import java.util.Collection;

/**
 * Custom Principal chứa userId thay vì email/username
 * Được dùng để routing STOMP messages đến đúng user
 */
public class UserIdPrincipal extends org.springframework.security.authentication.UsernamePasswordAuthenticationToken {

   private final String userId;

   public UserIdPrincipal(String userId, Object principal, Object credentials,
         Collection<? extends GrantedAuthority> authorities) {
      super(principal, credentials, authorities);
      this.userId = userId;
   }

   @Override
   public String getName() {
      // Return userId thay vì username/email
      // Điều này đảm bảo convertAndSendToUser sẽ gửi đến /user/{userId}/queue/...
      return this.userId;
   }
}
