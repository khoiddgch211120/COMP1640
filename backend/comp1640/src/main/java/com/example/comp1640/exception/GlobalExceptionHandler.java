package com.example.comp1640.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequest(BadRequestException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorized(UnauthorizedException ex) {
        return build(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này");
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<?> handleDisabled(DisabledException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Tài khoản đã bị vô hiệu hóa");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", HttpStatus.BAD_REQUEST.value(),
                "message", "Validation failed",
                "errors", errors));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(),
                        violation -> violation.getMessage()));
        return ResponseEntity.badRequest().body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", HttpStatus.BAD_REQUEST.value(),
                "message", "Validation failed",
                "errors", errors));
    }

    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<?> handleInvalidFormat(InvalidFormatException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", HttpStatus.BAD_REQUEST.value(),
                "message", "Invalid format: " + ex.getOriginalMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi hệ thống: " + ex.getMessage());
    }

    private ResponseEntity<?> build(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", status.value(),
                "message", message));
    }
}
