package com.example.backend.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.UserResponse;
import com.example.backend.models.Review;
import com.example.backend.repositories.ReviewRepo;
import com.example.backend.services.UserService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class DoctorController {

    private final UserService userService;
    private final ReviewRepo reviewRepo;

    // Publicly list doctors for the Find Therapist page (no auth required)
    @GetMapping("/doctors")
    public ResponseEntity<List<UserResponse>> publicDoctors() {
        return ResponseEntity.ok(userService.listDoctors());
    }

    @Data
    public static class DoctorProfileResponse {
        private final UserResponse doctor;
        private final Double averageRating; // may be null
        private final Long reviewsCount;    // may be null
    }

    // Public doctor profile
    @GetMapping("/doctors/{id}/profile")
    @PreAuthorize("permitAll()")
    public ResponseEntity<DoctorProfileResponse> getDoctorProfile(@PathVariable UUID id) {
        UserResponse doctor = userService.getById(id);
        Double avg = reviewRepo.getAverageRating(id);
        Long cnt = reviewRepo.getReviewsCount(id);
        return ResponseEntity.ok(new DoctorProfileResponse(doctor, avg, cnt));
    }

    // Public doctor reviews
    @GetMapping("/doctors/{id}/reviews")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Review>> getDoctorReviews(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewRepo.findByDoctorIdOrderByCreatedAtDesc(id));
    }
}
