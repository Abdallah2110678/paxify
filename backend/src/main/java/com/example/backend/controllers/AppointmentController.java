package com.example.backend.controllers;

import com.example.backend.dto.BookAppointmentRequest;
import com.example.backend.dto.CreateAppointmentRequest;
import com.example.backend.models.Appointment;
import com.example.backend.models.AppointmentStatus;
import com.example.backend.services.AppointmentService;
import com.example.backend.repositories.AppointmentRepo;
import com.example.backend.dto.AppointmentSummary;
import com.example.backend.models.User;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
        
        Appointment appointment = appointmentService.bookAppointment(appointmentId, request.getPatientId(), request.getPaymentMethod());
        return ResponseEntity.ok(appointment);
    }

    // Get appointments by doctor
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable UUID doctorId) {
        // Ensure expired AVAILABLE slots are rolled forward immediately
        appointmentService.rescheduleExpiredAvailableForDoctor(doctorId);
        List<Appointment> appointments = appointmentRepo
            .findByDoctorIdAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(doctorId, LocalDateTime.now());
        return ResponseEntity.ok(appointments);
    }

    // Get appointments by patient
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('PATIENT', 'ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<AppointmentSummary>> getAppointmentsByPatient(@PathVariable UUID patientId) {
        List<Appointment> appointments = appointmentRepo.findByPatientIdWithDoctorOrderByAppointmentDateTimeAsc(patientId);
        List<AppointmentSummary> result = appointments.stream().map(a -> {
            var d = a.getDoctor();
            return new AppointmentSummary(
                a.getId(),
                a.getAppointmentDateTime(),
                a.getStatus(),
                d != null ? d.getId() : null,
                d != null ? d.getName() : null,
                a.getSessionType(),
                a.getPrice()
            );
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // Get current patient's appointments using JWT principal
    @GetMapping("/me")
    @PreAuthorize("hasAuthority('PATIENT')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<AppointmentSummary>> getMyAppointments(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID patientId = user.getId();
        List<Appointment> appointments = appointmentRepo.findByPatientIdOrderByAppointmentDateTimeAsc(patientId);
        List<AppointmentSummary> result = appointments.stream().map(a -> {
            var d = a.getDoctor();
            return new AppointmentSummary(
                a.getId(),
                a.getAppointmentDateTime(),
                a.getStatus(),
                d != null ? d.getId() : null,
                d != null ? d.getName() : null,
                a.getSessionType(),
                a.getPrice()
            );
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // Get available appointments by doctor (public endpoint for booking)
    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<List<Appointment>> getAvailableAppointmentsByDoctor(@PathVariable UUID doctorId) {
        // Ensure expired AVAILABLE slots are rolled forward immediately
        appointmentService.rescheduleExpiredAvailableForDoctor(doctorId);
        List<Appointment> appointments = appointmentRepo
            .findByDoctorIdAndStatusAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(
                doctorId, AppointmentStatus.AVAILABLE, LocalDateTime.now());
        return ResponseEntity.ok(appointments);
    }

    // Public: Get FUTURE appointments by doctor including all statuses (for greying out booked slots)
    @GetMapping("/doctor/{doctorId}/public/future")
    public ResponseEntity<List<Appointment>> getDoctorFutureAppointmentsPublic(@PathVariable UUID doctorId) {
        appointmentService.rescheduleExpiredAvailableForDoctor(doctorId);
        List<Appointment> appointments = appointmentRepo
            .findByDoctorIdAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(doctorId, LocalDateTime.now());
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
    @PreAuthorize("hasAuthority('DOCTOR')")
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

    // Patient cancels their own appointment (releases slot)
    @PostMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<Appointment> cancelByPatient(
            @PathVariable UUID appointmentId,
            @RequestParam UUID patientId) {
        Appointment appointment = appointmentService.cancelByPatient(appointmentId, patientId);
        return ResponseEntity.ok(appointment);
    }

    // Patient cancels their own appointment using JWT principal
    @PostMapping("/{appointmentId}/cancel/me")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<Appointment> cancelByPatientMe(
            @PathVariable UUID appointmentId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Appointment appointment = appointmentService.cancelByPatient(appointmentId, user.getId());
        return ResponseEntity.ok(appointment);
    }
}
