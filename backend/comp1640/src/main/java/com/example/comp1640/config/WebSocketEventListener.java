package com.example.comp1640.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
public class WebSocketEventListener {

   @EventListener
   public void handleWebSocketConnect(SessionConnectEvent event) {
      String sessionId = event.getMessage().getHeaders().get("simpSessionId", String.class);
      log.info("✓ WebSocket client connected - SessionId: {}", sessionId);
   }

   @EventListener
   public void handleWebSocketDisconnect(SessionDisconnectEvent event) {
      String sessionId = event.getSessionId();
      log.info("✓ WebSocket client disconnected - SessionId: {}", sessionId);
   }
}
