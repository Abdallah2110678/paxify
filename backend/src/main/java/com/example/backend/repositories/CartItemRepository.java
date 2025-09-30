package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}