// dto/DoctorCreateRequest.java
package com.example.backend.dto;

import com.example.backend.models.Gender;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record DoctorCreateRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6) String password,
        String phoneNumber,
        String address,
        Gender gender,
        String specialty,
        String bio,
        BigDecimal rate,
        BigDecimal consultationFee,
        String availability,
        String profilePictureUrl) {
}
