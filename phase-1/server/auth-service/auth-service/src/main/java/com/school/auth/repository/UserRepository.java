package com.school.auth.repository;

import com.school.auth.model.User;
import com.school.auth.model.User.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByActiveTrue();
    
    List<User> findByActiveFalse();
    
    List<User> findByDepartment(String department);
    
    long countByRole(Role role);
    
    long countByActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.role = ?1 AND u.active = ?2")
    List<User> findByRoleAndActiveStatus(Role role, boolean active);
}