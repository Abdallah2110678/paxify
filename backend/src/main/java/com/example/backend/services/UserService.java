// services/UserCrudService.java
package com.example.backend.services;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.DoctorCreateRequest;
import com.example.backend.dto.DoctorUpdateRequest;
import com.example.backend.dto.PatientCreateRequest;
import com.example.backend.dto.PatientUpdateRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.dto.UserUpdateRequest;
import com.example.backend.models.Doctor;
import com.example.backend.models.Patient;
import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.repositories.DoctorRepo;
import com.example.backend.repositories.PatientRepo;
import com.example.backend.repositories.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

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
        Doctor doctor = doctorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Common fields
        if (req.name() != null)
            doctor.setName(req.name());
        if (req.email() != null)
            doctor.setEmail(req.email().toLowerCase());
        if (req.phoneNumber() != null)
            doctor.setPhoneNumber(req.phoneNumber());
        if (req.address() != null)
            doctor.setAddress(req.address());
        if (req.password() != null)
            doctor.setPassword(encoder.encode(req.password()));

        // Doctor-specific fields
        if (req.specialty() != null)
            doctor.setSpecialty(req.specialty());
        if (req.bio() != null)
            doctor.setBio(req.bio());
        if (req.rate() != null)
            doctor.setRate(req.rate());
        if (req.consultationFee() != null)
            doctor.setConsultationFee(req.consultationFee());
        if (req.availability() != null)
            doctor.setAvailability(req.availability());
        if (req.profilePictureUrl() != null)
            doctor.setProfilePictureUrl(req.profilePictureUrl());

        return toResponse(userRepo.save(doctor));
    }

    @Transactional
    public UserResponse updatePatient(UUID id, PatientUpdateRequest req) {
        Patient p = (Patient) userRepo.findById(id)
                .filter(u -> u instanceof Patient)
                .orElseThrow(() -> new NoSuchElementException("Patient not found"));

        if (req.name() != null)
            p.setName(req.name());
        if (req.email() != null)
            p.setEmail(req.email().toLowerCase());
        if (req.phoneNumber() != null)
            p.setPhoneNumber(req.phoneNumber());
        if (req.address() != null)
            p.setAddress(req.address());
        if (req.gender() != null) {
            p.setGender(req.gender());
        }

        return toResponse(userRepo.save(p));
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
        if (u instanceof Doctor d) {
            return new UserResponse(
                    d.getId(),
                    "DOCTOR",
                    d.getName(),
                    d.getEmail(),
                    d.getPhoneNumber(),
                    d.getAddress(),
                    d.getRole(),
                    d.getGender(),
                    d.getProfilePictureUrl(), // profilePictureUrl

                    // doctor-only
                    d.getSpecialty(),
                    d.getBio(),
                    d.getRate(),
                    d.getConsultationFee(),
                    d.getAvailability());
        } else if (u instanceof Patient p) {
            return new UserResponse(
                    p.getId(),
                    "PATIENT",
                    p.getName(),
                    p.getEmail(),
                    p.getPhoneNumber(),
                    p.getAddress(),
                    p.getRole(),
                    p.getGender(),
                    null, // profilePictureUrl

                    // doctor-only -> nulls
                    null, null, null, null, null);
        } else {
            return new UserResponse(
                    u.getId(),
                    "USER",
                    u.getName(),
                    u.getEmail(),
                    u.getPhoneNumber(),
                    u.getAddress(),
                    u.getRole(),
                    u.getGender(),
                    null, // profilePictureUrl

                    // doctor-only -> nulls
                    null, null, null, null, null);
        }
    }
}
