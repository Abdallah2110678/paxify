// dto/UserUpdateRequest.java  (partial update for common fields)
package com.example.backend.dto;

import com.example.backend.models.Gender;

public record UserUpdateRequest(
        String name,
        String phoneNumber,
        String address,
        Gender gender,
        String password // optional; if provided, re-encode
) {
}
