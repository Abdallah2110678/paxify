package com.example.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.dto.AdminDashboardResponse;
import com.example.backend.models.Appointment;
import com.example.backend.models.AppointmentStatus;
import com.example.backend.models.Doctor;
import com.example.backend.repositories.AppointmentRepo;
import com.example.backend.repositories.DoctorRepo;
import com.example.backend.repositories.PatientRepo;
import com.example.backend.repositories.ProductRepository;

@ExtendWith(MockitoExtension.class)
class AdminDashboardServiceTest {

    @Mock
    private AppointmentRepo appointmentRepo;
    @Mock
    private DoctorRepo doctorRepo;
    @Mock
    private PatientRepo patientRepo;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private AdminDashboardService service;

    @Test
    void getDashboard_compilesKpisChartsAndActivity() {
        LocalDateTime now = LocalDateTime.now();
        Appointment completed = appointment(AppointmentStatus.COMPLETED, new BigDecimal("120.00"), now.minusDays(2));
        Appointment booked = appointment(AppointmentStatus.BOOKED, new BigDecimal("75.00"), now.minusHours(6));
        Appointment cancelled = appointment(AppointmentStatus.CANCELLED, new BigDecimal("500.00"), now.minusDays(30));
        Appointment oldCompleted = appointment(AppointmentStatus.COMPLETED, new BigDecimal("50.00"), now.minusMonths(13));

        when(appointmentRepo.findAll()).thenReturn(List.of(completed, booked, cancelled, oldCompleted));
        when(doctorRepo.count()).thenReturn(7L);
        when(doctorRepo.countByApprovalStatus(Doctor.ApprovalStatus.PENDING)).thenReturn(3L);
        when(patientRepo.count()).thenReturn(20L);
        when(productRepository.count()).thenReturn(15L);
        when(productRepository.countByStockLessThanEqual(any())).thenReturn(2L);

        Doctor reviewedApproved = doctor("Dr. Recent", Doctor.ApprovalStatus.APPROVED, now.minusHours(1));
        when(doctorRepo.findAll()).thenReturn(List.of(reviewedApproved));

        AdminDashboardResponse response = service.getDashboard();

        assertThat(response.totalIncome()).isEqualByComparingTo("170.00");
        assertThat(response.totalDoctors()).isEqualTo(7);
        assertThat(response.pendingDoctors()).isEqualTo(3);
        assertThat(response.totalPatients()).isEqualTo(20);
        assertThat(response.totalProducts()).isEqualTo(15);
        assertThat(response.lowStockProducts()).isEqualTo(2);
        assertThat(response.patientBreakdown().regular()).isEqualTo(20);
        assertThat(response.patientBreakdown().newlyRegistered()).isZero();
        assertThat(response.patientBreakdown().emergency()).isZero();

        assertThat(response.monthlyIncome()).hasSize(12);
        YearMonth currentMonth = YearMonth.from(now);
        String label = currentMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + currentMonth.getYear();
        AdminDashboardResponse.MonthlyIncomePoint currentPoint = response.monthlyIncome().stream()
                .filter(p -> p.month().equals(label))
                .findFirst()
                .orElseThrow();
        assertThat(currentPoint.income()).isEqualByComparingTo("120.00");

        List<String> activityTypes = response.recentActivity().stream()
                .map(AdminDashboardResponse.ActivityItem::type)
                .toList();
        assertThat(activityTypes).containsExactly(
                "DOCTOR_APPROVED",
                "APPOINTMENT_BOOKED",
                "APPOINTMENT_COMPLETED",
                "APPOINTMENT_COMPLETED");
        assertThat(response.recentActivity()).isSortedAccordingTo((a, b) -> b.occurredAt().compareTo(a.occurredAt()));
    }

    private Appointment appointment(AppointmentStatus status, BigDecimal price, LocalDateTime when) {
        Appointment appointment = new Appointment();
        appointment.setStatus(status);
        appointment.setPrice(price);
        appointment.setAppointmentDateTime(when);
        return appointment;
    }

    private Doctor doctor(String name, Doctor.ApprovalStatus status, LocalDateTime reviewedAt) {
        Doctor doctor = new Doctor();
        doctor.setId(UUID.randomUUID());
        doctor.setName(name);
        doctor.setApprovalStatus(status);
        doctor.setReviewedAt(reviewedAt);
        return doctor;
    }
}
