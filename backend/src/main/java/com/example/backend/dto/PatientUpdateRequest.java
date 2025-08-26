package com.example.backend.dto;

import com.example.backend.models.Gender;

public record PatientUpdateRequest(
        String name,
        String email,
        String phoneNumber,
        String address,
        Gender gender) {
}
