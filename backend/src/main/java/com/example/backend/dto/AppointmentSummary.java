package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.backend.models.AppointmentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentSummary {
    private UUID id;
    private LocalDateTime dateTime;
    private AppointmentStatus status;
    private UUID doctorId;
    private String doctorName;
    private String sessionType;
    private BigDecimal price;
}
