package com.example.backend.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

import com.example.backend.models.Appointment;
import com.example.backend.models.AppointmentStatus;
import com.example.backend.models.Doctor;
import com.example.backend.models.Patient;
import com.example.backend.models.PaymentMethod;
import com.example.backend.repositories.AppointmentRepo;
import com.example.backend.repositories.DoctorRepo;
import com.example.backend.repositories.PatientRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepo appointmentRepo;
    private final DoctorRepo doctorRepo;
    private final PatientRepo patientRepo;

    // Create appointment (doctor creates available slots)
    public Appointment createAppointment(UUID doctorId, LocalDateTime dateTime,
                                         Integer durationMinutes, String sessionType,
                                         java.math.BigDecimal price, String notes) {
        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setAppointmentDateTime(dateTime);
        appointment.setDurationMinutes(durationMinutes != null ? durationMinutes : 60);
        // Default to "ONLINE"; allow only ONLINE or IN_PERSON
        String st = (sessionType == null || sessionType.isBlank()) ? "ONLINE" : sessionType.toUpperCase();
        if (!st.equals("ONLINE") && !st.equals("IN_PERSON")) {
            st = "ONLINE";
        }
        appointment.setSessionType(st);
        // Default to doctor's consultation fee if price is not provided
        appointment.setPrice(price != null ? price : doctor.getConsultationFee());
        appointment.setNotes(notes);
        appointment.setStatus(AppointmentStatus.AVAILABLE);

        return appointmentRepo.save(appointment);
    }

    // Patient cancels and deletes the appointment row entirely
    public void cancelByPatientAndDelete(UUID appointmentId, UUID patientId) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getPatient() == null || appointment.getPatient().getId() == null
                || !appointment.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("You can only cancel your own appointment");
        }

        appointmentRepo.delete(appointment);
    }

    public void rescheduleExpiredAvailableForDoctor(UUID doctorId) {
        LocalDateTime now = LocalDateTime.now();
        var expired = appointmentRepo.findByDoctorIdAndStatusAndAppointmentDateTimeBefore(doctorId, AppointmentStatus.AVAILABLE, now);
        if (expired == null || expired.isEmpty()) return;
        for (var a : expired) {
            // Ensure we roll forward until it is in the future (in case of long downtime)
            LocalDateTime dt = a.getAppointmentDateTime();
            while (dt.isBefore(now)) {
                dt = dt.plusWeeks(1);
            }
            a.setAppointmentDateTime(dt);
            // Safety: ensure next week's slot belongs to no patient
            a.setPatient(null);
            a.setPaymentMethod(null);
            a.setStatus(AppointmentStatus.AVAILABLE);
        }
        appointmentRepo.saveAll(expired);
    }

    // Nightly job: roll all expired AVAILABLE appointments forward to the next week
    @Scheduled(cron = "0 5 0 * * *")
    public void rescheduleExpiredAvailableGlobal() {
        LocalDateTime now = LocalDateTime.now();
        var expired = appointmentRepo.findByStatusAndAppointmentDateTimeBefore(AppointmentStatus.AVAILABLE, now);
        if (expired == null || expired.isEmpty()) return;
        for (var a : expired) {
            LocalDateTime dt = a.getAppointmentDateTime();
            while (dt.isBefore(now)) {
                dt = dt.plusWeeks(1);
            }
            a.setAppointmentDateTime(dt);
            // Safety: ensure rolled slots are clean
            a.setPatient(null);
            a.setPaymentMethod(null);
            a.setStatus(AppointmentStatus.AVAILABLE);
        }
        appointmentRepo.saveAll(expired);
    }

    // Book appointment (patient books an available slot)
    public Appointment bookAppointment(UUID appointmentId, UUID patientId, PaymentMethod paymentMethod) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.AVAILABLE) {
            throw new RuntimeException("Appointment is not available for booking");
        }

        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        appointment.setPatient(patient);
        // default method
        PaymentMethod pm = paymentMethod == null ? PaymentMethod.CASH : paymentMethod;
        appointment.setPaymentMethod(pm);
        if (pm == PaymentMethod.VISA) {
            appointment.setStatus(AppointmentStatus.PENDING_PAYMENT);
        } else {
            appointment.setStatus(AppointmentStatus.BOOKED);
        }
        // removed updatedAt tracking

        return appointmentRepo.save(appointment);
    }

    // Update appointment status
    public Appointment updateAppointmentStatus(UUID appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        // removed updatedAt tracking

        return appointmentRepo.save(appointment);
    }

    // Patient cancels their own appointment: release the slot
    public Appointment cancelByPatient(UUID appointmentId, UUID patientId) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getPatient() == null || appointment.getPatient().getId() == null
                || !appointment.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("You can only cancel your own appointment");
        }

        // Release slot for booking again
        appointment.setPatient(null);
        appointment.setStatus(AppointmentStatus.AVAILABLE);
        appointment.setPaymentMethod(null);

        return appointmentRepo.save(appointment);
    }


    // Delete appointment
    public void deleteAppointment(UUID appointmentId) {
        if (!appointmentRepo.existsById(appointmentId)) {
            throw new RuntimeException("Appointment not found");
        }
        appointmentRepo.deleteById(appointmentId);
    }

    // Update appointment details
    public Appointment updateAppointment(UUID appointmentId, LocalDateTime dateTime, 
                                       Integer durationMinutes, String sessionType, 
                                       java.math.BigDecimal price, String notes) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (dateTime != null) appointment.setAppointmentDateTime(dateTime);
        if (durationMinutes != null) appointment.setDurationMinutes(durationMinutes);
        if (sessionType != null) {
            String st = sessionType.toUpperCase();
            if (st.equals("ONLINE") || st.equals("IN_PERSON")) {
                appointment.setSessionType(st);
            }
        }
        if (price != null) appointment.setPrice(price);
        if (notes != null) appointment.setNotes(notes);
        // removed updatedAt tracking

        return appointmentRepo.save(appointment);
    }
}
