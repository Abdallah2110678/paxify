package com.example.backend.controllers;

import com.example.backend.services.JwtService;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.DoctorCreateRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.models.Doctor;
import com.example.backend.models.Gender;
import com.example.backend.models.Patient;
import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.repositories.PatientRepo;
import com.example.backend.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepo userRepo;
    private final PatientRepo patientRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final AuthenticationManager authenticationManager;

    @GetMapping("/debug-auth")
    @PreAuthorize("isAuthenticated()")
    public String debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return "Authorities: " + auth.getAuthorities();
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
            @RequestParam("file") MultipartFile file,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String phoneNumber,
            @RequestParam String gender,
            @RequestParam String specialty,
            @RequestParam String bio,
            @RequestParam BigDecimal consultationFee,
            @RequestParam String availability) throws java.io.IOException {

        if (userRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Save file
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/profile-pictures");
        if (!Files.exists(uploadPath))
            Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setEmail(email.toLowerCase());
        doctor.setPassword(encoder.encode(password));
        doctor.setPhoneNumber(phoneNumber);
        doctor.setGender(Gender.valueOf(gender.toUpperCase()));
        doctor.setSpecialty(specialty);
        doctor.setBio(bio);
        doctor.setConsultationFee(consultationFee);
        doctor.setAvailability(availability);
        doctor.setProfilePictureUrl("/uploads/profile-pictures/" + filename);
        doctor.setRole(Role.DOCTOR);

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