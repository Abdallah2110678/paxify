package com.example.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.models.Review;

@Repository
public interface ReviewRepo extends JpaRepository<Review, UUID> {
    List<Review> findByDoctorIdOrderByCreatedAtDesc(UUID doctorId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.doctor.id = :doctorId")
    Double getAverageRating(@Param("doctorId") UUID doctorId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.doctor.id = :doctorId")
    Long getReviewsCount(@Param("doctorId") UUID doctorId);
}
