package com.example.backend.models;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    // public URL to play the game (itch.io, your own page, etc)
    @Column(length = 500)
    private String externalUrl;

    // stored as /uploads/games/<file>
    private String imageUrl;
    private String videoUrl;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant updatedAt;

    @PreUpdate
    public void touch() {
        this.updatedAt = Instant.now();
    }
}
