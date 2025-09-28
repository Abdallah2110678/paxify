package com.example.backend.controllers;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.Doctor;
import com.example.backend.models.User;
import com.example.backend.repositories.DoctorRepo;
import com.example.backend.repositories.UserRepo;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepo userRepo;
    private final DoctorRepo doctorRepo;

    // GET /api/admin/doctors?status=PENDING|APPROVED|REJECTED
    @GetMapping("/doctors")
    public ResponseEntity<?> listDoctors(@RequestParam(required = false) String status) {
        List<Doctor> doctors;

        if (status == null || status.isBlank()) {
            doctors = doctorRepo.findAll();
        } else {
            Doctor.ApprovalStatus parsed;
            try {
                parsed = Doctor.ApprovalStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest()
                        .body("Invalid status. Use one of: PENDING, APPROVED, REJECTED.");
            }
            doctors = doctorRepo.findByApprovalStatus(parsed);
        }

        // Map to a safe payload (avoid exposing inherited password field)
        List<Map<String, Object>> out = doctors.stream().map(d -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", d.getId());
            m.put("name", d.getName());
            m.put("email", d.getEmail());
            m.put("phoneNumber", d.getPhoneNumber());
            m.put("address", d.getAddress());
            m.put("gender", d.getGender());
            m.put("specialty", d.getSpecialty());
            m.put("bio", d.getBio());
            m.put("consultationFee", d.getConsultationFee());
            m.put("profilePictureUrl", d.getProfilePictureUrl());
            m.put("approvalStatus", d.getApprovalStatus().name());
            m.put("reviewedAt", d.getReviewedAt());
            m.put("reviewedByAdminId", d.getReviewedByAdminId());
            m.put("rejectionReason", d.getRejectionReason());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }

    // POST /api/admin/doctors/{id}/approve
    @PostMapping("/doctors/{id}/approve")
    public ResponseEntity<?> approveDoctor(@PathVariable UUID id) {
        User u = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!(u instanceof Doctor d)) {
            return ResponseEntity.badRequest().body("User is not a doctor");
        }
        if (d.getApprovalStatus() == Doctor.ApprovalStatus.APPROVED) {
            return ResponseEntity.ok("Already approved.");
        }

        d.setApprovalStatus(Doctor.ApprovalStatus.APPROVED);
        d.setReviewedAt(LocalDateTime.now());

        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User admin) {
            d.setReviewedByAdminId(admin.getId());
        }
        d.setRejectionReason(null);

        userRepo.save(d);
        return ResponseEntity.ok("Doctor approved.");
    }

    // POST /api/admin/doctors/{id}/reject body: { "reason": "Missing license" }
    @PostMapping("/doctors/{id}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body == null) ? null : body.get("reason");

        User u = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!(u instanceof Doctor d)) {
            return ResponseEntity.badRequest().body("User is not a doctor");
        }
        if (d.getApprovalStatus() == Doctor.ApprovalStatus.REJECTED) {
            return ResponseEntity.ok("Already rejected.");
        }

        d.setApprovalStatus(Doctor.ApprovalStatus.REJECTED);
        d.setReviewedAt(LocalDateTime.now());

        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User admin) {
            d.setReviewedByAdminId(admin.getId());
        }
        d.setRejectionReason(reason);

        userRepo.save(d);
        return ResponseEntity.ok("Doctor rejected.");
    }

    // GET /api/admin/doctors/{id}
    // AdminController.java (only the getDoctor() method shown here)

    @GetMapping("/doctors/{id}")
    public ResponseEntity<?> getDoctor(@PathVariable UUID id) {
        var user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!(user instanceof Doctor d))
            return ResponseEntity.badRequest().body("User is not a doctor");

        Map<String, Object> m = new LinkedHashMap<>();
        // Identity & contact
        m.put("id", d.getId());
        m.put("name", d.getName());
        m.put("email", d.getEmail());
        m.put("phoneNumber", d.getPhoneNumber());
        m.put("address", d.getAddress());
        m.put("gender", d.getGender());
        m.put("profilePictureUrl", d.getProfilePictureUrl());

        // Professional
        m.put("specialty", d.getSpecialty());
        m.put("bio", d.getBio());
        m.put("consultationFee", d.getConsultationFee());

        // Availability (include whichever your model supports)
        try { // if your entity has these getters
            var cls = d.getClass();
            var hasFrom = cls.getMethod("getAvailableFrom");
            var hasTo = cls.getMethod("getAvailableTo");
            m.put("availableFrom", hasFrom.invoke(d));
            m.put("availableTo", hasTo.invoke(d));
        } catch (Exception ignore) {
            // If your model instead stores a single "availability" string:
            try {
                var meth = d.getClass().getMethod("getAvailability");
                m.put("availability", meth.invoke(d));
            } catch (Exception ignore2) {
                /* not present */ }
        }

        // Admin review/approval
        m.put("approvalStatus", d.getApprovalStatus().name());
        m.put("reviewedAt", d.getReviewedAt());
        m.put("reviewedByAdminId", d.getReviewedByAdminId());
        m.put("rejectionReason", d.getRejectionReason());
        m.put("rate", d.getRate());

        // (Optional) createdAt, updatedAt if you have them
        try {
            var cls = d.getClass();
            m.put("createdAt", cls.getMethod("getCreatedAt").invoke(d));
            m.put("updatedAt", cls.getMethod("getUpdatedAt").invoke(d));
        } catch (Exception ignore) {
        }

        return ResponseEntity.ok(m);
    }

    // PATCH /api/admin/doctors/{id}/review body: { "adminNotes": "...", "rate": 4.5
    // }
    @PatchMapping("/doctors/{id}/review")
    public ResponseEntity<?> updateDoctorReview(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body) {
        var user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!(user instanceof Doctor d))
            return ResponseEntity.badRequest().body("User is not a doctor");
        if (body.containsKey("rate")) {
            // Accept number or string
            try {
                var num = new java.math.BigDecimal(String.valueOf(body.get("rate")));
                d.setRate(num);
            } catch (Exception ignored) {
            }
        }
        userRepo.save(d);
        return ResponseEntity.ok("Review updated.");
    }

}
