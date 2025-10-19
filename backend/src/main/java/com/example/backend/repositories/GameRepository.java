package com.example.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.Game;

public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findAllByActiveTrueOrderByCreatedAtDesc();
}
