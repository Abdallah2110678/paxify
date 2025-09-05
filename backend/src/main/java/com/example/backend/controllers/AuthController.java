package com.example.backend.controllers;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.models.Doctor;
import com.example.backend.models.Gender;
import com.example.backend.models.Patient;
import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.repositories.UserRepo;
import com.example.backend.services.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepo userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final AuthenticationManager authenticationManager;

    @GetMapping("/debug-auth")
    @PreAuthorize("isAuthenticated()")
    public java.util.Map<String, Object> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        if (auth == null) {
            map.put("authenticated", false);
            return map;
        }
        map.put("authenticated", true);
        map.put("authorities", auth.getAuthorities().toString());
        Object principal = auth.getPrincipal();
        map.put("principalClass", principal == null ? "null" : principal.getClass().getName());
        if (principal instanceof com.example.backend.models.User u) {
            map.put("userId", u.getId() == null ? null : u.getId().toString());
            map.put("email", u.getEmail());
            map.put("role", u.getRole() == null ? null : u.getRole().name());
            map.put("isDoctorSubclass", (u instanceof com.example.backend.models.Doctor));
        }
        return map;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        log.info("Registration request received for email: {}", req.email());

        try {
            if (userRepo.findByEmail(req.email()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            User user;
            Patient patient = new Patient();
            patient.setName(req.name());
            patient.setEmail(req.email().toLowerCase());
            patient.setPassword(encoder.encode(req.password()));
            patient.setRole(Role.PATIENT);
            patient.setGender(req.gender());
            patient.setAddress(req.address());
            patient.setPhoneNumber(req.phoneNumber());
            user = userRepo.save(patient);

            String token = jwt.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (Exception e) {
            log.error("Registration error for email {}: ", req.email(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration error: " + e.getMessage());
        }
    }

    @PostMapping("/register-doctor")
    public ResponseEntity<?> registerDoctor(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String phoneNumber,
            @RequestParam String gender,
            @RequestParam String specialty,
            @RequestParam String bio,
            @RequestParam BigDecimal consultationFee,
            @RequestParam(required = false) String availability) throws java.io.IOException {

        if (userRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setEmail(email.toLowerCase());
        doctor.setPassword(encoder.encode(password));
        doctor.setPhoneNumber(phoneNumber);
        doctor.setGender(Gender.valueOf(gender.toUpperCase()));
        doctor.setSpecialty(specialty);
        doctor.setBio(bio);
        doctor.setConsultationFee(consultationFee);
        // Availability is now handled through appointments
        doctor.setRole(Role.DOCTOR);

        // Handle optional file upload
        if (file != null && !file.isEmpty()) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/profile-pictures");
            if (!Files.exists(uploadPath))
                Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            doctor.setProfilePictureUrl("/uploads/profile-pictures/" + filename);
        }

        userRepo.save(doctor);

        String token = jwt.generateToken(doctor);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User admin = new User();
        admin.setName(req.name());
        admin.setEmail(req.email().toLowerCase());
        admin.setPassword(encoder.encode(req.password()));
        admin.setRole(Role.ADMIN);
        admin.setGender(req.gender());
        userRepo.save(admin);

        String token = jwt.generateToken(admin);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        final String email = req.email() == null ? null : req.email().toLowerCase();
        log.info("Login request received for email: {}", email);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, req.password()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Object principal = authentication.getPrincipal();
            User user;
            if (principal instanceof User u) {
                user = u; // your entity (preferred path)
            } else if (principal instanceof org.springframework.security.core.userdetails.User secUser) {
                // fallback: look up your entity by username/email
                user = userRepo.findByEmail(secUser.getUsername().toLowerCase())
                        .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
            } else {
                throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
            }

            String token = jwt.generateToken(user);
            log.info("Login successful for user: {}", user.getEmail());
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (BadCredentialsException e) {
            log.warn("Login failed - bad credentials for email: {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        } catch (AuthenticationException e) {
            log.error("Authentication failed for email {}: ", email, e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Login error for email {}: ", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login error: " + e.getMessage());
        }
    }

}