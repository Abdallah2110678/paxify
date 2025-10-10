package com.example.backend.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Doctor extends User {

    @Column(name = "specialty", length = 100)
    private String specialty;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "rate", precision = 4, scale = 2)
    private BigDecimal rate;

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "available_from")
    private LocalDateTime availableFrom;

    @Column(name = "available_to")
    private LocalDateTime availableTo;

    @Column(name = "profile_picture_url", length = 512)
    private String profilePictureUrl;

    public enum ApprovalStatus {
        PENDING, APPROVED, REJECTED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = true, length = 10)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "reviewed_by_admin_id", columnDefinition = "uuid")
    private UUID reviewedByAdminId;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Appointment> appointments;

    @Override
    public boolean isEnabled() {
        // Treat null as enabled to avoid blocking existing rows before admin review
        return this.approvalStatus == null || this.approvalStatus == ApprovalStatus.APPROVED;
    }
}
