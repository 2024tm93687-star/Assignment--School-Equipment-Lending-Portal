package com.school.auth.controller;

import com.school.auth.dto.*;
import com.school.auth.model.User;
import com.school.auth.repository.UserRepository;
import com.school.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            LoginResponse response = authService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            User user = authService.validateToken(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("username", user.getUsername());
            response.put("role", user.getRole().toString());
            response.put("userId", user.getId());
            response.put("message", "Token is valid");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            User user = authService.getCurrentUser(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("fullName", user.getFullName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().toString());
            response.put("roleDescription", user.getRole().getDescription());
            response.put("department", user.getDepartment());
            response.put("active", user.isActive());
            response.put("createdAt", user.getCreatedAt());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/is-admin")
    public ResponseEntity<?> isAdmin(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            boolean isAdmin = authService.isAdmin(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isAdmin", isAdmin);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/is-staff-or-admin")
    public ResponseEntity<?> isStaffOrAdmin(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            boolean isStaffOrAdmin = authService.isStaffOrAdmin(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isStaffOrAdmin", isStaffOrAdmin);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            String token = extractToken(authHeader);
            User user = authService.validateToken(token);
            
            authService.changePassword(
                user.getId(),
                request.getOldPassword(),
                request.getNewPassword(),
                token
            );
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            
            if (!authService.isAdmin(token)) {
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Only admins can view all users"));
            }
            
            List<User> users = userRepository.findAll();
            
            List<Map<String, Object>> userList = users.stream().map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("userId", user.getId());
                userMap.put("username", user.getUsername());
                userMap.put("fullName", user.getFullName());
                userMap.put("email", user.getEmail());
                userMap.put("role", user.getRole().toString());
                userMap.put("department", user.getDepartment());
                userMap.put("active", user.isActive());
                return userMap;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(userList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("Invalid role. Must be STUDENT, STAFF, or ADMIN"));
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);
            
            if (!authService.isAdmin(token)) {
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Only admins can view statistics"));
            }
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", userRepository.count());
            stats.put("activeUsers", userRepository.countByActiveTrue());
            stats.put("students", userRepository.countByRole(User.Role.STUDENT));
            stats.put("staff", userRepository.countByRole(User.Role.STAFF));
            stats.put("admins", userRepository.countByRole(User.Role.ADMIN));
            
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Invalid authorization header format");
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return error;
    }
}