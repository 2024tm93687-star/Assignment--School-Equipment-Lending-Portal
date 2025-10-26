package com.school.auth.service;

import com.school.auth.dto.LoginRequest;
import com.school.auth.dto.LoginResponse;
import com.school.auth.dto.SignupRequest;
import com.school.auth.model.User;
import com.school.auth.repository.UserRepository;
import com.school.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }
        
        User user = userOpt.get();
        
        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated. Please contact administrator.");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        String token = jwtUtil.generateToken(
            user.getUsername(),
            user.getId(),
            user.getRole().toString()
        );
        
        return new LoginResponse(
            token,
            user.getId(),
            user.getUsername(),
            user.getFullName(),
            user.getEmail(),
            user.getRole().toString(),
            user.getDepartment(),
            "Login successful"
        );
    }
    
    public LoginResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists. Please choose a different username.");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered. Please use a different email.");
        }
        
        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role. Must be STUDENT, STAFF, or ADMIN.");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(role);
        user.setDepartment(request.getDepartment());
        user.setActive(true);
        
        user = userRepository.save(user);
        
        String token = jwtUtil.generateToken(
            user.getUsername(),
            user.getId(),
            user.getRole().toString()
        );
        
        return new LoginResponse(
            token,
            user.getId(),
            user.getUsername(),
            user.getFullName(),
            user.getEmail(),
            user.getRole().toString(),
            user.getDepartment(),
            "Account created successfully"
        );
    }
    
    public User validateToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                throw new RuntimeException("User not found");
            }
            
            User user = userOpt.get();
            
            if (!jwtUtil.validateToken(token, username)) {
                throw new RuntimeException("Invalid or expired token");
            }
            
            if (!user.isActive()) {
                throw new RuntimeException("Account is deactivated");
            }
            
            return user;
            
        } catch (Exception e) {
            throw new RuntimeException("Token validation failed: " + e.getMessage());
        }
    }
    
    public User getCurrentUser(String token) {
        return validateToken(token);
    }
    
    public boolean hasRole(String token, String requiredRole) {
        try {
            User user = validateToken(token);
            return user.getRole().toString().equals(requiredRole);
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isAdmin(String token) {
        return hasRole(token, "ADMIN");
    }
    
    public boolean isStaffOrAdmin(String token) {
        try {
            User user = validateToken(token);
            String role = user.getRole().toString();
            return role.equals("STAFF") || role.equals("ADMIN");
        } catch (Exception e) {
            return false;
        }
    }
    
    public void deactivateUser(Long userId, String adminToken) {
        if (!isAdmin(adminToken)) {
            throw new RuntimeException("Only admins can deactivate user accounts");
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        user.setActive(false);
        userRepository.save(user);
    }
    
    public void reactivateUser(Long userId, String adminToken) {
        if (!isAdmin(adminToken)) {
            throw new RuntimeException("Only admins can reactivate user accounts");
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        user.setActive(true);
        userRepository.save(user);
    }
    
    public void changePassword(Long userId, String oldPassword, String newPassword, String token) {
        User currentUser = validateToken(token);
        
        if (!currentUser.getId().equals(userId) && !isAdmin(token)) {
            throw new RuntimeException("You can only change your own password");
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}