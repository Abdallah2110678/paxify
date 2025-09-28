package com.example.backend.dto;

import com.example.backend.models.PaymentMethod;
import lombok.Data;
import java.util.UUID;

@Data
public class BookAppointmentRequest {
    private UUID patientId;
    private PaymentMethod paymentMethod;
    private String paymentReference;
}
