package com.expense.tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.expense.tracker.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.expense.tracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import com.expense.tracker.security.JwtUtil;
import com.expense.tracker.service.EmailService;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Value("${app.api.url}")
    private String apiBaseUrl;

    @Value("${app.client.url}")
    private String clientBaseUrl;

    @Autowired
    private EmailService emailService;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginAuthRequest request) {

        String identifier = request.getIdentifier(); // username or email
        String password = request.getPassword();
    
        // Lookup by email or username
        Optional<User> optionalUser = identifier.contains("@")
                ? userRepository.findByEmail(identifier)
                : userRepository.findByUsername(identifier);
    
        if (optionalUser.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    
        User user = optionalUser.get();
    
        if (!user.isVerified())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email not verified");
    
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), password)
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterAuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        String token = UUID.randomUUID().toString();

        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // hash the password
        newUser.setVerificationToken(token);
        newUser.setVerified(false);

        userRepository.save(newUser);

        String verificationLink = apiBaseUrl + "/auth/verify?token=" + token;

        try {
            emailService.sendVerificationEmail(
                newUser.getEmail(), // assuming this is the email
                "Verify your ExpenseApp account",
                "Click the link to verify your account: " + verificationLink
            );
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send verification email.");
        }

        return ResponseEntity.ok("User registered successfully. Please check your email to verify your account.");
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            // Redirect to frontend error page
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", clientBaseUrl + "/verify?status=invalid")
                    .build();
        }

        User user = userOpt.get();

        if (user.isVerified()) {
            // Redirect to frontend already-verified page
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", clientBaseUrl + "/verify?status=already")
                    .build();
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        // Redirect to frontend success page
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", clientBaseUrl + "/verify?status=success")
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<User> user = userRepository.findByUsername(authentication.getName());

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    

    @Getter
    @Setter
    static class LoginAuthRequest {
        private String identifier;
        private String password;
    }

    @Getter
    @Setter
    static class RegisterAuthRequest {
        private String email;
        private String username;
        private String password;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    static class AuthResponse {
        private String token;
    }
}