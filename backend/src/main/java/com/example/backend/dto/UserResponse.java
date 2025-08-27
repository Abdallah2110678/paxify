// dto/UserResponse.java
package com.example.backend.dto;

import java.util.UUID;

import com.example.backend.models.Gender;
import com.example.backend.models.Role;

public record UserResponse(
                UUID id,
                String userType, // "PATIENT" / "DOCTOR" / "USER"
                String name,
                String email,
                String phoneNumber,
                String address,
                Role role,
                Gender gender,
                String profilePictureUrl) {
}
