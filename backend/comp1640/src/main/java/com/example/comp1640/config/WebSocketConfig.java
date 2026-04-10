package com.example.comp1640.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import com.example.comp1640.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.MessageDeliveryException;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

   private final JwtTokenUtil jwtTokenUtil;
   private final UserDetailsService userDetailsService;

   @Override
   public void configureMessageBroker(MessageBrokerRegistry config) {
      // Tạo in-memory message broker với prefixes
      config.enableSimpleBroker("/topic", "/queue");

      // Prefix cho messages gửi từ client đến server
      config.setApplicationDestinationPrefixes("/app");

      // Prefix cho user-specific messages
      config.setUserDestinationPrefix("/user");
   }

   @Override
   public void registerStompEndpoints(StompEndpointRegistry registry) {
      // Endpoint để client kết nối tới
      registry.addEndpoint("/ws/notifications")
            .setAllowedOrigins("http://localhost:5173", "http://localhost:3000")
            .setAllowedOriginPatterns("*")
            .withSockJS()
            .setClientLibraryUrl("https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js");
   }

   @Override
   public void configureClientInboundChannel(ChannelRegistration registration) {
      // ✅ Thêm interceptor để xauthenticate STOMP connect request
      registration.interceptors(new ChannelInterceptor() {
         @Override
         public Message<?> preSend(Message<?> message, MessageChannel channel) {
            StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                  message,
                  StompHeaderAccessor.class);

            if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
               // Lấy Authorization header từ STOMP connect headers
               String authHeader = accessor.getFirstNativeHeader("Authorization");

               if (authHeader != null && authHeader.startsWith("Bearer ")) {
                  String token = authHeader.substring(7);

                  try {
                     // Validate token
                     if (jwtTokenUtil.validateToken(token)) {
                        String email = jwtTokenUtil.getEmailFromToken(token);
                        Integer userId = jwtTokenUtil.getUserIdFromToken(token);

                        if (email != null && userId != null) {
                           // Load user details
                           UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                           // Create custom authentication token sử dụng UserIdPrincipal
                           // Điều này đảm bảo STOMP routing sẽ gửi đến /user/{userId}/queue/...
                           UserIdPrincipal authentication = new UserIdPrincipal(
                                 userId.toString(),
                                 userDetails,
                                 null,
                                 userDetails.getAuthorities());

                           // Set authentication in header
                           accessor.setUser(authentication);

                           System.out.println("✓ WebSocket user authenticated: " + email + " (userId: " + userId + ")");
                        } else {
                           throw new MessageDeliveryException(message,
                                 "Invalid token claims — WebSocket connection rejected");
                        }
                     } else {
                        throw new MessageDeliveryException(message,
                              "Invalid or expired token — WebSocket connection rejected");
                     }
                  } catch (Exception e) {
                     throw new MessageDeliveryException(message,
                           "WebSocket authentication error: " + e.getMessage(), e);
                  }
               } else {
                  throw new MessageDeliveryException(message,
                        "Missing Authorization header — unauthenticated WebSocket connections are not allowed");
               }
            }

            return message;
         }
      });
   }
}
