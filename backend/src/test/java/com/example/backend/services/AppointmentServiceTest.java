package com.example.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.models.Appointment;
import com.example.backend.models.AppointmentStatus;
import com.example.backend.models.Doctor;
import com.example.backend.models.Patient;
import com.example.backend.models.PaymentMethod;
import com.example.backend.models.RecurrenceType;
import com.example.backend.repositories.AppointmentRepo;
import com.example.backend.repositories.DoctorRepo;
import com.example.backend.repositories.PatientRepo;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepo appointmentRepo;
    @Mock
    private DoctorRepo doctorRepo;
    @Mock
    private PatientRepo patientRepo;

    @InjectMocks
    private AppointmentService service;

    @Test
    void createAppointment_defaultsMissingValues() {
        UUID doctorId = UUID.randomUUID();
        Doctor doctor = new Doctor();
        doctor.setId(doctorId);
        doctor.setConsultationFee(new BigDecimal("90"));

        when(doctorRepo.findById(doctorId)).thenReturn(Optional.of(doctor));
        when(appointmentRepo.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        LocalDateTime slot = LocalDateTime.now().plusDays(2);
        Appointment created = service.createAppointment(doctorId, slot, null, "remote", null, "notes", null);

        assertThat(created.getDoctor()).isEqualTo(doctor);
        assertThat(created.getAppointmentDateTime()).isEqualTo(slot);
        assertThat(created.getDurationMinutes()).isEqualTo(60);
        assertThat(created.getSessionType()).isEqualTo("ONLINE");
        assertThat(created.getPrice()).isEqualByComparingTo("90");
        assertThat(created.getStatus()).isEqualTo(AppointmentStatus.AVAILABLE);
        assertThat(created.getRecurrenceType()).isEqualTo(RecurrenceType.WEEKLY);
        assertThat(created.getNotes()).isEqualTo("notes");
        verify(appointmentRepo).save(any(Appointment.class));
    }

    @Test
    void cancelByPatientAndDelete_removesOwnedAppointment() {
        UUID appointmentId = UUID.randomUUID();
        UUID patientId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        Patient owner = new Patient();
        owner.setId(patientId);
        appointment.setPatient(owner);

        when(appointmentRepo.findById(appointmentId)).thenReturn(Optional.of(appointment));

        service.cancelByPatientAndDelete(appointmentId, patientId);

        verify(appointmentRepo).delete(appointment);
    }

    @Test
    void cancelByPatientAndDelete_rejectsDifferentPatient() {
        UUID appointmentId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        Patient owner = new Patient();
        owner.setId(UUID.randomUUID());
        appointment.setPatient(owner);

        when(appointmentRepo.findById(appointmentId)).thenReturn(Optional.of(appointment));

        assertThatThrownBy(() -> service.cancelByPatientAndDelete(appointmentId, UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("cancel your own appointment");
        verify(appointmentRepo, never()).delete(any());
    }

    @Test
    void bookAppointment_setsPatientAndPaymentStatusForVisa() {
        UUID appointmentId = UUID.randomUUID();
        UUID patientId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        appointment.setStatus(AppointmentStatus.AVAILABLE);
        Patient patient = new Patient();
        patient.setId(patientId);

        when(appointmentRepo.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(patientRepo.findById(patientId)).thenReturn(Optional.of(patient));
        when(appointmentRepo.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        Appointment updated = service.bookAppointment(appointmentId, patientId, PaymentMethod.VISA);

        assertThat(updated.getPatient()).isEqualTo(patient);
        assertThat(updated.getPaymentMethod()).isEqualTo(PaymentMethod.VISA);
        assertThat(updated.getStatus()).isEqualTo(AppointmentStatus.PENDING_PAYMENT);
    }

    @Test
    void bookAppointment_defaultsPaymentMethodToCash() {
        UUID appointmentId = UUID.randomUUID();
        UUID patientId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        appointment.setStatus(AppointmentStatus.AVAILABLE);
        Patient patient = new Patient();
        patient.setId(patientId);

        when(appointmentRepo.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(patientRepo.findById(patientId)).thenReturn(Optional.of(patient));
        when(appointmentRepo.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        Appointment updated = service.bookAppointment(appointmentId, patientId, null);

        assertThat(updated.getPaymentMethod()).isEqualTo(PaymentMethod.CASH);
        assertThat(updated.getStatus()).isEqualTo(AppointmentStatus.BOOKED);
    }

    @Test
    void bookAppointment_rejectsUnavailableSlots() {
        Appointment appointment = new Appointment();
        appointment.setStatus(AppointmentStatus.BOOKED);
        when(appointmentRepo.findById(any(UUID.class))).thenReturn(Optional.of(appointment));

        assertThatThrownBy(() -> service.bookAppointment(UUID.randomUUID(), UUID.randomUUID(), PaymentMethod.CASH))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not available");
    }

    @Test
    void cancelByPatient_releasesSlotForSamePatient() {
        UUID appointmentId = UUID.randomUUID();
        UUID patientId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        Patient owner = new Patient();
        owner.setId(patientId);
        appointment.setPatient(owner);
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setPaymentMethod(PaymentMethod.VISA);

        when(appointmentRepo.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(appointmentRepo.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        Appointment freed = service.cancelByPatient(appointmentId, patientId);

        assertThat(freed.getPatient()).isNull();
        assertThat(freed.getStatus()).isEqualTo(AppointmentStatus.AVAILABLE);
        assertThat(freed.getPaymentMethod()).isNull();
    }

    @Test
    void cancelByPatient_rejectsOtherPatients() {
        Appointment appointment = new Appointment();
        Patient owner = new Patient();
        owner.setId(UUID.randomUUID());
        appointment.setPatient(owner);
        when(appointmentRepo.findById(any())).thenReturn(Optional.of(appointment));

        assertThatThrownBy(() -> service.cancelByPatient(UUID.randomUUID(), UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("cancel your own appointment");
    }

    @Test
    void updateAppointmentStatus_persistsValue() {
        UUID appointmentId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        when(appointmentRepo.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(appointmentRepo.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        Appointment updated = service.updateAppointmentStatus(appointmentId, AppointmentStatus.COMPLETED);

        assertThat(updated.getStatus()).isEqualTo(AppointmentStatus.COMPLETED);
        verify(appointmentRepo).save(appointment);
    }

    @Test
    void updateAppointment_updatesProvidedFieldsAndValidSessionType() {
        UUID appointmentId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        appointment.setSessionType("IN_PERSON");
        when(appointmentRepo.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(appointmentRepo.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        LocalDateTime newSlot = LocalDateTime.now().plusDays(5);
        Appointment updated = service.updateAppointment(
                appointmentId,
                newSlot,
                30,
                "IN_PERSON",
                new BigDecimal("150"),
                "Bring reports");

        assertThat(updated.getAppointmentDateTime()).isEqualTo(newSlot);
        assertThat(updated.getDurationMinutes()).isEqualTo(30);
        assertThat(updated.getSessionType()).isEqualTo("IN_PERSON");
        assertThat(updated.getPrice()).isEqualByComparingTo("150");
        assertThat(updated.getNotes()).isEqualTo("Bring reports");
    }

    @Test
    void deleteAppointment_checksExistence() {
        UUID appointmentId = UUID.randomUUID();
        when(appointmentRepo.existsById(appointmentId)).thenReturn(true);

        service.deleteAppointment(appointmentId);

        verify(appointmentRepo).deleteById(appointmentId);

        when(appointmentRepo.existsById(appointmentId)).thenReturn(false);
        assertThatThrownBy(() -> service.deleteAppointment(appointmentId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void rescheduleExpiredAvailableForDoctor_movesWeeklyAndDeletesOneTime() {
        UUID doctorId = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        Appointment weekly = new Appointment();
        weekly.setAppointmentDateTime(now.minusDays(3));
        weekly.setStatus(AppointmentStatus.AVAILABLE);
        weekly.setRecurrenceType(RecurrenceType.WEEKLY);
        weekly.setPatient(new Patient());
        weekly.setPaymentMethod(PaymentMethod.CASH);

        Appointment oneTime = new Appointment();
        oneTime.setAppointmentDateTime(now.minusDays(2));
        oneTime.setStatus(AppointmentStatus.AVAILABLE);
        oneTime.setRecurrenceType(RecurrenceType.ONE_TIME);

        List<Appointment> expired = new ArrayList<>(List.of(weekly, oneTime));
        when(appointmentRepo.findByDoctorIdAndStatusAndAppointmentDateTimeBefore(eq(doctorId), eq(AppointmentStatus.AVAILABLE), any(LocalDateTime.class)))
                .thenReturn(expired);

        service.rescheduleExpiredAvailableForDoctor(doctorId);

        ArgumentCaptor<List<Appointment>> captor = ArgumentCaptor.forClass(List.class);
        verify(appointmentRepo).saveAll(captor.capture());
        List<Appointment> saved = captor.getValue();
        assertThat(saved).containsExactly(weekly);
        assertThat(weekly.getPatient()).isNull();
        assertThat(weekly.getPaymentMethod()).isNull();
        assertThat(weekly.getStatus()).isEqualTo(AppointmentStatus.AVAILABLE);
        assertThat(weekly.getAppointmentDateTime()).isAfter(now);
        verify(appointmentRepo).delete(oneTime);
    }

    @Test
    void rescheduleExpiredAvailableGlobal_handlesExpiredSlots() {
        LocalDateTime now = LocalDateTime.now();

        Appointment weekly = new Appointment();
        weekly.setAppointmentDateTime(now.minusDays(10));
        weekly.setStatus(AppointmentStatus.AVAILABLE);
        weekly.setRecurrenceType(RecurrenceType.WEEKLY);
        weekly.setPatient(new Patient());
        weekly.setPaymentMethod(PaymentMethod.CASH);

        Appointment oneTime = new Appointment();
        oneTime.setAppointmentDateTime(now.minusDays(1));
        oneTime.setStatus(AppointmentStatus.AVAILABLE);
        oneTime.setRecurrenceType(RecurrenceType.ONE_TIME);

        List<Appointment> expired = new ArrayList<>(List.of(weekly, oneTime));
        when(appointmentRepo.findByStatusAndAppointmentDateTimeBefore(eq(AppointmentStatus.AVAILABLE), any(LocalDateTime.class)))
                .thenReturn(expired);

        service.rescheduleExpiredAvailableGlobal();

        verify(appointmentRepo).saveAll(any());
        assertThat(weekly.getAppointmentDateTime()).isAfter(now);
        assertThat(weekly.getPatient()).isNull();
        verify(appointmentRepo).delete(oneTime);
    }
}
