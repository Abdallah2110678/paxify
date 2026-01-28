package com.example.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.example.backend.models.Game;
import com.example.backend.repositories.GameRepository;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository repository;

    @InjectMocks
    private GameService service;

    @Test
    void listPublic_delegatesToRepository() {
        List<Game> games = List.of(Game.builder().id(1L).title("Puzzle").build());
        when(repository.findAllByActiveTrueOrderByCreatedAtDesc()).thenReturn(games);

        assertThat(service.listPublic()).isEqualTo(games);
    }

    @Test
    void get_returnsGameOrThrows() {
        Game game = Game.builder().id(4L).title("Maze").build();
        when(repository.findById(4L)).thenReturn(Optional.of(game));
        assertThat(service.get(4L)).isEqualTo(game);

        when(repository.findById(4L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.get(4L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Game not found");
    }

    @Test
    void create_resetsIdBeforeSaving() {
        Game request = Game.builder().id(99L).title("Blocks").build();
        when(repository.save(any(Game.class))).thenAnswer(inv -> inv.getArgument(0));

        Game saved = service.create(request);

        assertThat(saved.getId()).isNull();
        verify(repository).save(request);
    }

    @Test
    void update_appliesEditableFields() {
        Game existing = Game.builder()
                .id(7L)
                .title("Old")
                .description("old desc")
                .externalUrl("http://old")
                .imageUrl("/img.png")
                .videoUrl("/vid.mp4")
                .active(true)
                .build();
        Game incoming = Game.builder()
                .title("New Title")
                .description("New Desc")
                .externalUrl("http://new")
                .active(false)
                .build();
        when(repository.findById(7L)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        Game updated = service.update(7L, incoming);

        assertThat(updated.getTitle()).isEqualTo("New Title");
        assertThat(updated.getDescription()).isEqualTo("New Desc");
        assertThat(updated.getExternalUrl()).isEqualTo("http://new");
        assertThat(updated.isActive()).isFalse();
        assertThat(updated.getImageUrl()).isEqualTo("/img.png");
        assertThat(updated.getVideoUrl()).isEqualTo("/vid.mp4");
    }

    @Test
    void delete_delegatesToRepository() {
        service.delete(3L);
        verify(repository).deleteById(3L);
    }

    @Test
    void uploadImage_savesFileAndUpdatesUrl() throws Exception {
        Game game = Game.builder().id(5L).title("Space").build();
        when(repository.findById(5L)).thenReturn(Optional.of(game));
        when(repository.save(game)).thenReturn(game);
        MockMultipartFile file = new MockMultipartFile("file", "cover.png", "image/png", "img".getBytes());

        Game updated = service.uploadImage(5L, file);
        assertThat(updated.getImageUrl()).startsWith("/uploads/games/images/");
        Path saved = resolveUploadPath(updated.getImageUrl());
        try {
            assertThat(Files.exists(saved)).isTrue();
        } finally {
            deleteQuietly(saved);
        }
    }

    @Test
    void uploadVideo_savesFileAndUpdatesUrl() throws Exception {
        Game game = Game.builder().id(6L).title("Space").build();
        when(repository.findById(6L)).thenReturn(Optional.of(game));
        when(repository.save(game)).thenReturn(game);
        MockMultipartFile file = new MockMultipartFile("file", "clip.mp4", "video/mp4", new byte[] {1, 2, 3});

        Game updated = service.uploadVideo(6L, file);
        assertThat(updated.getVideoUrl()).startsWith("/uploads/games/videos/");
        Path saved = resolveUploadPath(updated.getVideoUrl());
        try {
            assertThat(Files.exists(saved)).isTrue();
        } finally {
            deleteQuietly(saved);
        }
    }

    private Path resolveUploadPath(String publicUrl) {
        String relative = publicUrl.startsWith("/") ? publicUrl.substring(1) : publicUrl;
        return Paths.get("").toAbsolutePath().resolve(Paths.get(relative));
    }

    private void deleteQuietly(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
        }
    }
}
