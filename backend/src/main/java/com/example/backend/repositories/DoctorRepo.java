package com.example.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.Doctor;
import com.example.backend.models.Doctor.ApprovalStatus;

public interface DoctorRepo extends JpaRepository<Doctor, UUID> {

    List<Doctor> findByApprovalStatus(ApprovalStatus status);

    long countByApprovalStatus(Doctor.ApprovalStatus status);

    @Query(value = "SELECT * FROM doctor WHERE approval_status = :status", nativeQuery = true)
    List<Doctor> findByApprovalStatus(@Param("status") String status);

}
