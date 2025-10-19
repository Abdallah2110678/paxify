package com.example.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.models.Game;
import com.example.backend.repositories.GameRepository;

@Service
@Transactional
public class GameService {

    private final GameRepository repo;

    public GameService(GameRepository repo) {
        this.repo = repo;
    }

    public List<Game> listPublic() {
        return repo.findAllByActiveTrueOrderByCreatedAtDesc();
    }

    public List<Game> listAll() {
        return repo.findAll();
    }

    public Game get(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
    }

    public Game create(Game g) {
        g.setId(null);
        return repo.save(g);
    }

    public Game update(Long id, Game g) {
        Game db = get(id);
        db.setTitle(g.getTitle());
        db.setDescription(g.getDescription());
        db.setExternalUrl(g.getExternalUrl());
        db.setActive(g.isActive());
        // imageUrl/videoUrl are set via upload endpoints
        return repo.save(db);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    /* ---------- Media uploads ---------- */

    public Game uploadImage(Long id, MultipartFile file) throws IOException {
        Game db = get(id);
        String rel = saveFile(file, "images");
        db.setImageUrl(rel);
        return repo.save(db);
    }

    public Game uploadVideo(Long id, MultipartFile file) throws IOException {
        Game db = get(id);
        String rel = saveFile(file, "videos");
        db.setVideoUrl(rel);
        return repo.save(db);
    }

    private String saveFile(MultipartFile file, String subfolder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Empty file");
        }
        Path base = Paths.get("uploads", "games", subfolder);
        if (!Files.exists(base))
            Files.createDirectories(base);

        String safeName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path dest = base.resolve(safeName);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        // public URL path
        return "/uploads/games/" + subfolder + "/" + safeName;
    }
}
