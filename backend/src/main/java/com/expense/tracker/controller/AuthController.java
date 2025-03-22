package com.expense.tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.expense.tracker.model.User;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import com.expense.tracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import com.expense.tracker.security.JwtUtil;
import com.expense.tracker.service.EmailService;

import lombok.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private EmailService emailService;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserDetailsService userDetailsService,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
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

        String verificationLink = "https://expense-tracker-xi-beige.vercel.app/verify?token=" + token;

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
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        User user = userOpt.get();

        if (user.isVerified()) {
            return ResponseEntity.ok("Account already verified.");
        }

        user.setVerified(true);
        user.setVerificationToken(null); // Optional: Clear token
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully. You can now log in.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        return ResponseEntity.ok(userRepository.findByUsername(authentication.getName()).get());
    }
    

    @Getter
    @Setter
    static class AuthRequest {
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