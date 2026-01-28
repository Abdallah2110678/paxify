package com.example.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.models.Product;
import com.example.backend.repositories.ProductRepository;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @InjectMocks
    private ProductService service;

    @Test
    void getAll_returnsRepositoryResult() {
        List<Product> products = List.of(Product.builder().id(1L).name("Therapy Putty").build());
        when(repository.findAll()).thenReturn(products);
        assertThat(service.getAll()).isEqualTo(products);
    }

    @Test
    void getById_returnsProductOrThrows() {
        Product product = Product.builder().id(2L).name("Flash Cards").build();
        when(repository.findById(2L)).thenReturn(Optional.of(product));
        assertThat(service.getById(2L)).isEqualTo(product);

        when(repository.findById(2L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.getById(2L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void create_savesEntity() {
        Product product = Product.builder().name("Chew Toy").build();
        when(repository.save(product)).thenReturn(product);
        assertThat(service.create(product)).isEqualTo(product);
        verify(repository).save(product);
    }

    @Test
    void update_appliesIncomingValues() {
        Product existing = Product.builder()
                .id(5L)
                .name("Old")
                .description("Old desc")
                .price(new BigDecimal("10"))
                .stock(3)
                .imageUrl("old.png")
                .build();
        Product incoming = Product.builder()
                .name("New Name")
                .description("New Desc")
                .price(new BigDecimal("12.50"))
                .stock(6)
                .imageUrl("new.png")
                .build();
        when(repository.findById(5L)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        Product updated = service.update(5L, incoming);

        assertThat(updated.getName()).isEqualTo("New Name");
        assertThat(updated.getDescription()).isEqualTo("New Desc");
        assertThat(updated.getPrice()).isEqualByComparingTo("12.50");
        assertThat(updated.getStock()).isEqualTo(6);
        assertThat(updated.getImageUrl()).isEqualTo("new.png");
    }

    @Test
    void delete_delegatesToRepository() {
        service.delete(7L);
        verify(repository).deleteById(7L);
    }
}
