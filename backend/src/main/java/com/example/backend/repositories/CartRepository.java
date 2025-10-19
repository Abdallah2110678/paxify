package com.example.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.Cart;
import com.example.backend.models.User;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);

    // Cart + items + product (needed when open-in-view=false)
    @Query("""
                select c from Cart c
                left join fetch c.items i
                left join fetch i.product p
                where c.id = :id
            """)
    Optional<Cart> findByIdWithItems(@Param("id") Long id);

    @Query("""
                select c from Cart c
                left join fetch c.items i
                left join fetch i.product p
                where c.user = :user
            """)
    Optional<Cart> findByUserWithItems(@Param("user") User user);
}
