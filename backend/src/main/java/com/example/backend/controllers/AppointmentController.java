package com.example.backend.controllers;

import com.example.backend.dto.BookAppointmentRequest;
import com.example.backend.dto.CreateAppointmentRequest;
import com.example.backend.models.Appointment;
import com.example.backend.models.AppointmentStatus;
import com.example.backend.services.AppointmentService;
import com.example.backend.repositories.AppointmentRepo;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final AppointmentRepo appointmentRepo;

    // Create appointment (doctor creates available slots)
    @PostMapping
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<Appointment> createAppointment(@RequestBody CreateAppointmentRequest request) {
        
        if (request.getDoctorId() == null) {
            throw new IllegalArgumentException("DoctorId cannot be null");
        }
        
        Appointment appointment = appointmentService.createAppointment(
                request.getDoctorId(), request.getDateTime(), request.getDurationMinutes(), 
                request.getSessionType(), request.getPrice(), request.getNotes());
        return ResponseEntity.ok(appointment);
    }

    // Book appointment (patient books an available slot)
    @PostMapping("/{appointmentId}/book")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<Appointment> bookAppointment(
            @PathVariable UUID appointmentId,
            @RequestBody BookAppointmentRequest request) {
        
        Appointment appointment = appointmentService.bookAppointment(appointmentId, request.getPatientId());
        return ResponseEntity.ok(appointment);
    }

    // Get appointments by doctor
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable UUID doctorId) {
        List<Appointment> appointments = appointmentRepo.findByDoctorIdOrderByAppointmentDateTimeAsc(doctorId);
        return ResponseEntity.ok(appointments);
    }

    // Get appointments by patient
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('PATIENT', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable UUID patientId) {
        List<Appointment> appointments = appointmentRepo.findByPatientIdOrderByAppointmentDateTimeAsc(patientId);
        return ResponseEntity.ok(appointments);
    }

    // Get available appointments by doctor (public endpoint for booking)
    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<List<Appointment>> getAvailableAppointmentsByDoctor(@PathVariable UUID doctorId) {
        List<Appointment> appointments = appointmentRepo.findByDoctorIdAndStatusOrderByAppointmentDateTimeAsc(doctorId, AppointmentStatus.AVAILABLE);
        return ResponseEntity.ok(appointments);
    }

    // Get appointments by doctor and date range
    @GetMapping("/doctor/{doctorId}/range")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorAndDateRange(
            @PathVariable UUID doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<Appointment> appointments = appointmentRepo.findByDoctorAndDateRange(doctorId, startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    // Update appointment status
    @PatchMapping("/{appointmentId}/status")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT', 'ADMIN')")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable UUID appointmentId,
            @RequestParam AppointmentStatus status) {
        
        Appointment appointment = appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(appointment);
    }

    

    // Update appointment details
    @PatchMapping("/{appointmentId}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable UUID appointmentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime,
            @RequestParam(required = false) Integer durationMinutes,
            @RequestParam(required = false) String sessionType,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) String notes) {
        
        Appointment appointment = appointmentService.updateAppointment(
                appointmentId, dateTime, durationMinutes, sessionType, price, notes);
        return ResponseEntity.ok(appointment);
    }

    // Delete appointment
    @DeleteMapping("/{appointmentId}")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }
}
