package com.example.backend.models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Doctor extends User {

    @Column(name = "specialty", length = 100)
    private String specialty; // or use an Enum if you have a fixed list

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio; // LOB for longer bios

    @Column(name = "rate", precision = 4, scale = 2)
    private BigDecimal rate; // e.g., 0–99.99 rating; adjust as needed

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee; // money-safe

    @Column(name = "available_schedule", columnDefinition = "text")
    private String availability; // JSON or text e.g. {"mon":"9-17", ...}

    @Column(name = "profile_picture_url", length = 512)
    private String profilePictureUrl;
}
