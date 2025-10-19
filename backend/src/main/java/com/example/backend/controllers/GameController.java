package com.example.backend.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.models.Game;
import com.example.backend.services.GameService;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    /* -------- Public reads -------- */
    @GetMapping
    public List<Game> listPublic() {
        return service.listPublic();
    }

    @GetMapping("/{id}")
    public Game get(@PathVariable Long id) {
        return service.get(id);
    }

    /* -------- Admin writes -------- */
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Game> listAll() {
        return service.listAll();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Game create(@RequestBody Game g) {
        return service.create(g);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Game update(@PathVariable Long id, @RequestBody Game g) {
        return service.update(id, g);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    /* -------- Media uploads -------- */
    @PostMapping("/{id}/image")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Game uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        return service.uploadImage(id, file);
    }

    @PostMapping("/{id}/video")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Game uploadVideo(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        return service.uploadVideo(id, file);
    }
}
