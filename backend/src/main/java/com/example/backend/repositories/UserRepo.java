package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.models.Doctor;
import com.example.backend.models.Patient;
import com.example.backend.models.Role;
import com.example.backend.models.User;

public interface UserRepo extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("select p from Patient p")
    List<Patient> findAllPatients();

    @Query("select d from Doctor d")
    List<Doctor> findAllDoctors();

    @Query("select u from User u where u.role = 'ADMIN'")
    List<User> findAllAdmins();

    List<User> findByRole(Role role);

}
