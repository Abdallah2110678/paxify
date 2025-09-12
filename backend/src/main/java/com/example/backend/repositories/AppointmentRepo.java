package com.example.backend.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.models.Appointment;
import com.example.backend.models.AppointmentStatus;

@Repository
public interface AppointmentRepo extends JpaRepository<Appointment, UUID> {

    // Find appointments by doctor
    List<Appointment> findByDoctorIdOrderByAppointmentDateTimeAsc(UUID doctorId);

    // Find FUTURE appointments by doctor (exclude past)
    List<Appointment> findByDoctorIdAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(UUID doctorId, LocalDateTime now);

    // Find appointments by patient
    List<Appointment> findByPatientIdOrderByAppointmentDateTimeAsc(UUID patientId);

    // Find available appointments for a doctor
    List<Appointment> findByDoctorIdAndStatusOrderByAppointmentDateTimeAsc(UUID doctorId, AppointmentStatus status);

    // Find available FUTURE appointments for a doctor
    List<Appointment> findByDoctorIdAndStatusAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(UUID doctorId, AppointmentStatus status, LocalDateTime now);

    // Find appointments by doctor and date range
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDateTime BETWEEN :startDate AND :endDate ORDER BY a.appointmentDateTime ASC")
    List<Appointment> findByDoctorAndDateRange(@Param("doctorId") UUID doctorId, 
                                             @Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);

    // Find available appointments in date range
    @Query("SELECT a FROM Appointment a WHERE a.status = :status AND a.appointmentDateTime BETWEEN :startDate AND :endDate ORDER BY a.appointmentDateTime ASC")
    List<Appointment> findAvailableAppointmentsInRange(@Param("status") AppointmentStatus status,
                                                      @Param("startDate") LocalDateTime startDate,
                                                      @Param("endDate") LocalDateTime endDate);

    // Cleanup helpers
    void deleteByAppointmentDateTimeBeforeAndStatus(LocalDateTime cutoff, AppointmentStatus status);
    void deleteByAppointmentDateTimeBefore(LocalDateTime cutoff);

    // Find expired AVAILABLE appointments
    List<Appointment> findByStatusAndAppointmentDateTimeBefore(AppointmentStatus status, LocalDateTime before);

    // Find expired AVAILABLE appointments for a specific doctor
    List<Appointment> findByDoctorIdAndStatusAndAppointmentDateTimeBefore(UUID doctorId, AppointmentStatus status, LocalDateTime before);
}
