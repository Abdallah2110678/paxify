package com.example.backend.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
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

    @Column(name = "available_from")
    private LocalDateTime availableFrom;

    @Column(name = "available_to")
    private LocalDateTime availableTo;

    @Column(name = "profile_picture_url", length = 512)
    private String profilePictureUrl;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Appointment> appointments;
}
