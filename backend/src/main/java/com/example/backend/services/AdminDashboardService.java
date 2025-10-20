package com.example.backend.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.backend.dto.AdminDashboardResponse;
import com.example.backend.models.Appointment;
import com.example.backend.models.AppointmentStatus;
import com.example.backend.models.Doctor;
import com.example.backend.repositories.AppointmentRepo;
import com.example.backend.repositories.DoctorRepo;
import com.example.backend.repositories.PatientRepo;
import com.example.backend.repositories.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final AppointmentRepo appointmentRepo;
    private final DoctorRepo doctorRepo;
    private final PatientRepo patientRepo;
    private final ProductRepository productRepository;

    public AdminDashboardResponse getDashboard() {
        // Totals
        BigDecimal totalIncome = sumCompletedAppointmentsIncome();
        long totalDoctors = doctorRepo.count();
        long pendingDoctors = doctorRepo.countByApprovalStatus(Doctor.ApprovalStatus.PENDING);
        long totalPatients = patientRepo.count();
        long totalProducts = productRepository.count();
        long lowStockProducts = countLowStockProducts(5); // default threshold

        // Charts
        List<AdminDashboardResponse.MonthlyIncomePoint> monthlyIncome = computeLast12MonthsIncome();

        // Patient breakdown – limited data available, so approximate
        // regular = total patients, newlyRegistered and emergency not tracked yet
        AdminDashboardResponse.PatientBreakdown patientBreakdown =
                new AdminDashboardResponse.PatientBreakdown(totalPatients, 0, 0);

        // Recent activity – combine appointments and doctor reviews
        List<AdminDashboardResponse.ActivityItem> recentActivity = buildRecentActivity();

        return new AdminDashboardResponse(
                totalIncome,
                totalDoctors,
                pendingDoctors,
                totalPatients,
                totalProducts,
                lowStockProducts,
                monthlyIncome,
                patientBreakdown,
                recentActivity
        );
    }

    private BigDecimal sumCompletedAppointmentsIncome() {
        BigDecimal sum = BigDecimal.ZERO;
        for (Appointment a : appointmentRepo.findAll()) {
            if (a.getStatus() == AppointmentStatus.COMPLETED && a.getPrice() != null) {
                sum = sum.add(a.getPrice());
            }
        }
        return sum;
    }

    private long countLowStockProducts(int threshold) {
        try {
            // Prefer repository method if available via reflection to avoid compile errors if missing
            var method = productRepository.getClass().getMethod("countByStockLessThanEqual", Integer.class);
            Object res = method.invoke(productRepository, threshold);
            if (res instanceof Number n) return n.longValue();
        } catch (Exception ignore) { }
        // Fallback: iterate (works for small datasets, acceptable for first pass)
        return productRepository.findAll().stream()
                .filter(p -> p.getStock() != null && p.getStock() <= threshold)
                .count();
    }

    private List<AdminDashboardResponse.MonthlyIncomePoint> computeLast12MonthsIncome() {
        LocalDate today = LocalDate.now();
        YearMonth current = YearMonth.of(today.getYear(), today.getMonth());
        YearMonth start = current.minusMonths(11);

        Map<YearMonth, BigDecimal> incomeByMonth = new HashMap<>();
        for (int i = 0; i < 12; i++) {
            incomeByMonth.put(start.plusMonths(i), BigDecimal.ZERO);
        }

        for (Appointment a : appointmentRepo.findAll()) {
            if (a.getStatus() != AppointmentStatus.COMPLETED || a.getPrice() == null || a.getAppointmentDateTime() == null)
                continue;
            YearMonth ym = YearMonth.from(a.getAppointmentDateTime().toLocalDate());
            if (!ym.isBefore(start) && !ym.isAfter(current)) {
                incomeByMonth.put(ym, incomeByMonth.getOrDefault(ym, BigDecimal.ZERO).add(a.getPrice()));
            }
        }

        List<AdminDashboardResponse.MonthlyIncomePoint> points = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            YearMonth ym = start.plusMonths(i);
            String label = ym.getMonth().getDisplayName(TextStyle.SHORT, java.util.Locale.ENGLISH) + " " + ym.getYear();
            points.add(new AdminDashboardResponse.MonthlyIncomePoint(label, incomeByMonth.getOrDefault(ym, BigDecimal.ZERO)));
        }
        return points;
    }

    private List<AdminDashboardResponse.ActivityItem> buildRecentActivity() {
        List<AdminDashboardResponse.ActivityItem> out = new ArrayList<>();

        // Recent appointments (BOOKED/COMPLETED)
        for (Appointment a : appointmentRepo.findAll()) {
            if (a.getAppointmentDateTime() == null) continue;
            if (a.getStatus() == AppointmentStatus.BOOKED || a.getStatus() == AppointmentStatus.COMPLETED) {
                String type = a.getStatus() == AppointmentStatus.BOOKED ? "APPOINTMENT_BOOKED" : "APPOINTMENT_COMPLETED";
                String title = "Appointment";
                String details = "Status: " + a.getStatus() + ", Price: " + (a.getPrice() == null ? "-" : a.getPrice());
                out.add(new AdminDashboardResponse.ActivityItem(type, title, details, a.getAppointmentDateTime()));
            }
        }

        // Doctor reviews (approved/rejected)
        for (var d : doctorRepo.findAll()) {
            LocalDateTime reviewedAt = d.getReviewedAt();
            if (reviewedAt != null && d.getApprovalStatus() != null) {
                String type = "DOCTOR_" + d.getApprovalStatus().name();
                String title = "Doctor review: " + d.getName();
                String details = "Status: " + d.getApprovalStatus().name();
                out.add(new AdminDashboardResponse.ActivityItem(type, title, details, reviewedAt));
            }
        }

        out.sort(Comparator.comparing(AdminDashboardResponse.ActivityItem::occurredAt).reversed());
        return out.size() > 10 ? out.subList(0, 10) : out;
    }
}

