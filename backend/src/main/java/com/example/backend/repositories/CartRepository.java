package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
}