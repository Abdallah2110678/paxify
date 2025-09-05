// dto/DoctorUpdateRequest.java
package com.example.backend.dto;

import com.example.backend.models.Gender;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DoctorUpdateRequest(
        String name,
        String email,
        String phoneNumber,
        String address,
        Gender gender,
        String password,
        String specialty,
        String bio,
        BigDecimal rate,
        BigDecimal consultationFee,
        LocalDateTime availableFrom,
        LocalDateTime availableTo,
        String profilePictureUrl) {
}
