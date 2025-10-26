package com.school.auth;

import com.school.auth.model.User;
import com.school.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class AuthServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("   USER AUTHENTICATION SERVICE STARTED SUCCESSFULLY");
        System.out.println("=".repeat(60));
        System.out.println("API Base URL: http://localhost:8080/api/auth");
        System.out.println("H2 Console:   http://localhost:8080/h2-console");
        System.out.println("Database URL: jdbc:h2:file:./data/authdb");
        System.out.println("Username:     sa");
        System.out.println("Password:     (empty)");
        System.out.println("=".repeat(60) + "\n");
        
        System.out.println("Available Endpoints:");
        System.out.println("  POST   /api/auth/signup          - Register new user");
        System.out.println("  POST   /api/auth/login           - Login user");
        System.out.println("  GET    /api/auth/me              - Get current user");
        System.out.println("  GET    /api/auth/validate        - Validate token");
        System.out.println("  GET    /api/auth/is-admin        - Check if admin");
        System.out.println("  GET    /api/auth/is-staff-or-admin - Check if staff/admin");
        System.out.println("  POST   /api/auth/change-password - Change password");
        System.out.println("  PUT    /api/auth/deactivate/{id} - Deactivate user (Admin)");
        System.out.println("  PUT    /api/auth/reactivate/{id} - Reactivate user (Admin)");
        System.out.println("  GET    /api/auth/users           - Get all users (Admin)");
        System.out.println("=".repeat(60) + "\n");
    }
    
    @Bean
    CommandLineRunner initDatabase(UserRepository repository) {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            
            if (repository.count() == 0) {
                System.out.println("Initializing database with sample users...");
                
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin123"));
                admin.setFullName("Administrator");
                admin.setEmail("admin@school.com");
                admin.setRole(User.Role.ADMIN);
                admin.setDepartment("Administration");
                admin.setActive(true);
                repository.save(admin);
                
                User staff = new User();
                staff.setUsername("staff");
                staff.setPassword(encoder.encode("staff123"));
                staff.setFullName("Staff Member");
                staff.setEmail("staff@school.com");
                staff.setRole(User.Role.STAFF);
                staff.setDepartment("Equipment Management");
                staff.setActive(true);
                repository.save(staff);
                
                User student = new User();
                student.setUsername("student");
                student.setPassword(encoder.encode("student123"));
                student.setFullName("John Student");
                student.setEmail("student@school.com");
                student.setRole(User.Role.STUDENT);
                student.setDepartment("Computer Science");
                student.setActive(true);
                repository.save(student);
                
                System.out.println("\n✅ Sample users created:");
                System.out.println("   Admin:   username=admin,   password=admin123");
                System.out.println("   Staff:   username=staff,   password=staff123");
                System.out.println("   Student: username=student, password=student123\n");
            } else {
                System.out.println("Database already initialized with " + repository.count() + " users.");
            }
        };
    }
}