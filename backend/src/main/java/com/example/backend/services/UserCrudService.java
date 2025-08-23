// services/UserCrudService.java
package com.example.backend.services;

import com.example.backend.dto.*;
import com.example.backend.models.*;
import com.example.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCrudService {

    private final UserRepo userRepo;
    private final PatientRepo patientRepo;
    private final DoctorRepo doctorRepo;
    private final PasswordEncoder encoder;

    /* ======== CREATE ======== */

    @Transactional
    public UserResponse createPatient(PatientCreateRequest req) {
        if (userRepo.findByEmail(req.email().toLowerCase()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        Patient p = new Patient();
        p.setName(req.name());
        p.setEmail(req.email().toLowerCase());
        p.setPassword(encoder.encode(req.password()));
        p.setPhoneNumber(req.phoneNumber());
        p.setAddress(req.address());
        p.setGender(req.gender());
        p.setRole(Role.PATIENT);
        Patient saved = patientRepo.save(p);
        return toResponse(saved);
    }

    @Transactional
    public UserResponse createDoctor(DoctorCreateRequest req) {
        if (userRepo.findByEmail(req.email().toLowerCase()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        Doctor d = new Doctor();
        d.setName(req.name());
        d.setEmail(req.email().toLowerCase());
        d.setPassword(encoder.encode(req.password()));
        d.setPhoneNumber(req.phoneNumber());
        d.setAddress(req.address());
        d.setGender(req.gender());
        d.setRole(Role.DOCTOR);
        d.setSpecialty(req.specialty());
        d.setBio(req.bio());
        d.setRate(req.rate());
        d.setConsultationFee(req.consultationFee());
        d.setAvailability(req.availability());
        d.setProfilePictureUrl(req.profilePictureUrl());
        Doctor saved = doctorRepo.save(d);
        return toResponse(saved);
    }

    /* ======== READ ======== */

    @Transactional(readOnly = true)
    public List<UserResponse> listAllUsers() {
        return userRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listPatients() {
        return userRepo.findAllPatients().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listDoctors() {
        return userRepo.findAllDoctors().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        User u = userRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
        return toResponse(u);
    }

    /* ======== UPDATE (common) ======== */

    @Transactional
    public UserResponse updateCommon(UUID id, UserUpdateRequest req) {
        User u = userRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
        if (req.name() != null)
            u.setName(req.name());
        if (req.phoneNumber() != null)
            u.setPhoneNumber(req.phoneNumber());
        if (req.address() != null)
            u.setAddress(req.address());
        if (req.gender() != null)
            u.setGender(req.gender());
        if (req.password() != null && !req.password().isBlank()) {
            u.setPassword(encoder.encode(req.password()));
        }
        return toResponse(userRepo.save(u));
    }

    /* ======== UPDATE (doctor-specific) ======== */

    @Transactional
    public UserResponse updateDoctor(UUID id, DoctorUpdateRequest req) {
        Doctor d = (Doctor) userRepo.findById(id)
                .filter(u -> u instanceof Doctor)
                .orElseThrow(() -> new NoSuchElementException("Doctor not found"));
        if (req.specialty() != null)
            d.setSpecialty(req.specialty());
        if (req.bio() != null)
            d.setBio(req.bio());
        if (req.rate() != null)
            d.setRate(req.rate());
        if (req.consultationFee() != null)
            d.setConsultationFee(req.consultationFee());
        if (req.availability() != null)
            d.setAvailability(req.availability());
        if (req.profilePictureUrl() != null)
            d.setProfilePictureUrl(req.profilePictureUrl());
        return toResponse(userRepo.save(d));
    }

    /* ======== DELETE ======== */

    @Transactional
    public void delete(UUID id) {
        if (!userRepo.existsById(id))
            throw new NoSuchElementException("User not found");
        userRepo.deleteById(id);
    }

    /* ======== Mapper ======== */

    private UserResponse toResponse(User u) {
        String type = (u instanceof Doctor) ? "DOCTOR" : (u instanceof Patient) ? "PATIENT" : "USER";
        return new UserResponse(
                u.getId(),
                type,
                u.getName(),
                u.getEmail(),
                u.getPhoneNumber(),
                u.getAddress(),
                u.getRole(),
                u.getGender());
    }
}
