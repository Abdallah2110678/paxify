package com.example.backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.Doctor;

public interface DoctorRepo extends JpaRepository<Doctor, UUID> {}
