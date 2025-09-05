package com.example.backend.controllers;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.DoctorCreateRequest;
import com.example.backend.dto.DoctorUpdateRequest;
import com.example.backend.dto.PatientCreateRequest;
import com.example.backend.dto.PatientUpdateRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.dto.UserUpdateRequest;
import com.example.backend.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {

    private final UserService service;

    /* ======== CREATE ======== */
    // Patients can be created via public register OR admin here
    @PostMapping("/patients")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> createPatient(@RequestBody PatientCreateRequest req) {
        return ResponseEntity.ok(service.createPatient(req));
    }

    // Doctors usually created by admin
    @PostMapping("/doctors")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> createDoctor(@RequestBody DoctorCreateRequest req) {
        return ResponseEntity.ok(service.createDoctor(req));
    }

    @PostMapping("/{id}/profile-picture")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<UserResponse> uploadProfilePicture(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) throws java.io.IOException {

        // Save file locally (or to cloud/S3 etc.)
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/profile-pictures");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        // Store relative path in DB
        String fileUrl = "/uploads/profile-pictures/" + filename;

        DoctorUpdateRequest req = new DoctorUpdateRequest(
                null, // name
                null, // email
                null, // phoneNumber
                null, // address
                null, // gender
                null, // password
                null, // specialty
                null, // bio
                null, // rate
                null, // consultationFee
                null, // availableFrom
                null, // availableTo
                fileUrl // profilePictureUrl
        );

        return ResponseEntity.ok(service.updateDoctor(id, req));
    }

    /* ======== READ ======== */

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponse>> listAll() {
        return ResponseEntity.ok(service.listAllUsers());
    }

    @GetMapping("/patients")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponse>> listPatients() {
        return ResponseEntity.ok(service.listPatients());
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponse>> listDoctors() {
        return ResponseEntity.ok(service.listDoctors());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DOCTOR','PATIENT')")
    public ResponseEntity<UserResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /* ======== UPDATE ======== */

    // Update common fields (name, phone, address, gender, password)
    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> updateCommon(@PathVariable UUID id,
            @RequestBody UserUpdateRequest req) {
        return ResponseEntity.ok(service.updateCommon(id, req));
    }

    @PatchMapping("/{id}/patient")
    @PreAuthorize("hasAnyAuthority('ADMIN','PATIENT')")
    public ResponseEntity<UserResponse> updatePatient(
            @PathVariable UUID id,
            @RequestBody PatientUpdateRequest req) {
        return ResponseEntity.ok(service.updatePatient(id, req));
    }

    // Update doctor-only fields
    @PatchMapping("/{id}/doctor")
    @PreAuthorize("hasAnyAuthority('ADMIN','DOCTOR')")
    public ResponseEntity<UserResponse> updateDoctor(@PathVariable UUID id,
            @RequestBody DoctorUpdateRequest req) {
        return ResponseEntity.ok(service.updateDoctor(id, req));
    }

    /* ======== DELETE ======== */

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/patient")
    @PreAuthorize("hasAnyAuthority('ADMIN','PATIENT')")
    public ResponseEntity<Void> deletePatient(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/doctor")
    @PreAuthorize("hasAnyAuthority('ADMIN','DOCTOR')")
    public ResponseEntity<Void> deleteDoctor(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
