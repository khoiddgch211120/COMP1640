package com.example.comp1640.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

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
            .setAllowedOrigins("*")
            .withSockJS(); // Fallback cho browsers không support WebSocket
   }
}
