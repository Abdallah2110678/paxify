package com.example.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class BookAppointmentRequest {
    private UUID patientId;
}
