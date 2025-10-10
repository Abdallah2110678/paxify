package com.example.backend.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.example.backend.models.RecurrenceType;

@Data
public class CreateAppointmentRequest {
    private UUID doctorId;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateTime;
    
    private Integer durationMinutes;
    private String sessionType; // Allowed values: "ONLINE" or "IN_PERSON"
    private BigDecimal price;
    private String notes;
    private RecurrenceType recurrenceType; // ONE_TIME or WEEKLY (default WEEKLY if omitted)
}
