package com.example.backend.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ReviewCreateRequest;
import com.example.backend.models.Doctor;
import com.example.backend.models.Patient;
import com.example.backend.models.Review;
import com.example.backend.repositories.DoctorRepo;
import com.example.backend.repositories.PatientRepo;
import com.example.backend.repositories.ReviewRepo;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PatientController {

    private final ReviewRepo reviewRepo;
    private final DoctorRepo doctorRepo;
    private final PatientRepo patientRepo;

    // Patients submit a review for a doctor
    @PostMapping("/reviews")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<Review> createReview(@Valid @RequestBody ReviewCreateRequest req) {
        Doctor doctor = doctorRepo.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Best-effort attach authenticated patient
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Patient patient = null;
        if (auth != null && auth.getName() != null) {
            try {
                UUID patientId = UUID.fromString(auth.getName());
                patient = patientRepo.findById(patientId).orElse(null);
            } catch (Exception ignored) {}
        }

        Review r = new Review();
        r.setDoctor(doctor);
        r.setPatient(patient);
        r.setRating(req.getRating());
        r.setComment(req.getComment());
        return ResponseEntity.ok(reviewRepo.save(r));
    }
}
