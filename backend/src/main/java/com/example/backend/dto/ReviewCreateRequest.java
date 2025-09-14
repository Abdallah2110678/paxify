package com.example.backend.dto;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewCreateRequest {
    @NotNull
    private UUID doctorId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String comment;
}
