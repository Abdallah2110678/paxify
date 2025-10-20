// src/main/java/com/example/backend/dto/AdminDashboardResponse.java
package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminDashboardResponse(
        // KPIs
        BigDecimal totalIncome,
        long totalDoctors,
        long pendingDoctors,
        long totalPatients,
        long totalProducts,
        long lowStockProducts,
        // Charts
        List<MonthlyIncomePoint> monthlyIncome,
        PatientBreakdown patientBreakdown,
        // Activity
        List<ActivityItem> recentActivity) {
    public record MonthlyIncomePoint(String month, BigDecimal income) {
    }

    public record PatientBreakdown(long regular, long newlyRegistered, long emergency) {
    }

    public record ActivityItem(String type, String title, String details, LocalDateTime occurredAt) {
    }
}
