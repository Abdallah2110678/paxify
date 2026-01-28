package com.example.backend.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.backend.models.Doctor;
import com.example.backend.models.Gender;
import com.example.backend.models.Patient;
import com.example.backend.models.Role;

class JwtServiceTest {

    private final JwtService service = new JwtService();

    @BeforeEach
    void configureSecret() {
        String key = Base64.getEncoder().encodeToString("averylongsecrettestkey1234567890".getBytes(StandardCharsets.UTF_8));
        ReflectionTestUtils.setField(service, "secretKey", key);
        ReflectionTestUtils.setField(service, "expMinutes", 60);
    }

    @Test
    void generateToken_populatesRoleSpecificClaims() {
        Doctor doctor = new Doctor();
        doctor.setId(UUID.randomUUID());
        doctor.setEmail("doctor@paxify.com");
        doctor.setPassword("pw");
        doctor.setRole(Role.DOCTOR);
        doctor.setGender(Gender.OTHER);

        String token = service.generateToken(doctor);

        assertThat(service.extractUsername(token)).isEqualTo("doctor@paxify.com");
        var claims = service.getClaims(token);
        assertThat(claims.get("role")).isEqualTo("DOCTOR");
        assertThat(claims.get("userId")).isEqualTo(doctor.getId().toString());
        assertThat(claims.get("doctorId")).isEqualTo(doctor.getId().toString());
    }

    @Test
    void isTokenValid_checksUsernameAndExpiration() {
        Patient patient = new Patient();
        patient.setId(UUID.randomUUID());
        patient.setEmail("patient@paxify.com");
        patient.setPassword("pw");
        patient.setRole(Role.PATIENT);
        patient.setGender(Gender.FEMALE);

        String token = service.generateToken(patient);

        assertThat(service.isTokenValid(token, patient)).isTrue();

        Patient other = new Patient();
        other.setId(UUID.randomUUID());
        other.setEmail("other@paxify.com");
        other.setPassword("pw");
        other.setRole(Role.PATIENT);
        other.setGender(Gender.MALE);
        assertThat(service.isTokenValid(token, other)).isFalse();
    }
}
