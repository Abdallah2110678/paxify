// dto/DoctorUpdateRequest.java (doctor-specific patch)
package com.example.backend.dto;

import java.math.BigDecimal;

public record DoctorUpdateRequest(
        String specialty,
        String bio,
        BigDecimal rate,
        BigDecimal consultationFee,
        String availability,
        String profilePictureUrl) {
}
