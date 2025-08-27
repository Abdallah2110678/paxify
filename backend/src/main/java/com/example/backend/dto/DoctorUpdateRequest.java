// dto/DoctorUpdateRequest.java
package com.example.backend.dto;

import java.math.BigDecimal;

public record DoctorUpdateRequest(
        String name,
        String email,
        String phoneNumber,
        String address,
        String gender,
        String password,
        String specialty,
        String bio,
        BigDecimal rate,
        BigDecimal consultationFee,
        String availability,
        String profilePictureUrl) {
}
