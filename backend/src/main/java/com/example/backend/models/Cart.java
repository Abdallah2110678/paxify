package com.example.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many carts can belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // direct relation with UUID user

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CartItem> items = new ArrayList<>();
}