package com.example.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.models.Cart;
import com.example.backend.models.CartItem;
import com.example.backend.models.Product;
import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.repositories.CartItemRepository;
import com.example.backend.repositories.CartRepository;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.UserRepo;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private CartService service;

    private UUID userId;
    private User user;

    @BeforeEach
    void setUpUser() {
        userId = UUID.randomUUID();
        user = baseUser(userId);
    }

    @Test
    void createCart_returnsExistingCart() {
        Cart cart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserWithItems(user)).thenReturn(Optional.of(cart));

        Cart result = service.createCart(userId);

        assertThat(result).isEqualTo(cart);
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    void createCart_createsWhenMissing() {
        Cart cart = Cart.builder().id(22L).user(user).items(new ArrayList<>()).build();
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserWithItems(user)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        Cart result = service.createCart(userId);

        assertThat(result.getUser()).isEqualTo(user);
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void addProduct_incrementsExistingCartItem() {
        Cart cart = Cart.builder().id(3L).user(user).items(new ArrayList<>()).build();
        Product product = Product.builder().id(8L).name("Therapy Ball").build();
        CartItem item = CartItem.builder().id(5L).cart(cart).product(product).quantity(2).build();
        cart.getItems().add(item);

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserWithItems(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(product.getId())).thenReturn(Optional.of(product));
        when(cartRepository.findByIdWithItems(cart.getId())).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartItemRepository.save(item)).thenReturn(item);

        Cart updated = service.addProduct(userId, product.getId(), 3);

        assertThat(updated.getItems()).hasSize(1);
        assertThat(updated.getItems().get(0).getQuantity()).isEqualTo(5);
    }

    @Test
    void addProduct_addsNewCartItemWhenMissing() {
        Cart cart = Cart.builder().id(3L).user(user).items(new ArrayList<>()).build();
        Product product = Product.builder().id(9L).name("Puzzle").build();

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserWithItems(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(product.getId())).thenReturn(Optional.of(product));
        when(cartRepository.findByIdWithItems(cart.getId())).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(inv -> inv.getArgument(0));

        Cart updated = service.addProduct(userId, product.getId(), 1);

        assertThat(updated.getItems()).hasSize(1);
        assertThat(updated.getItems().get(0).getProduct()).isEqualTo(product);
        assertThat(updated.getItems().get(0).getQuantity()).isEqualTo(1);
    }

    @Test
    void addProduct_rejectsNonPositiveQuantity() {
        assertThatThrownBy(() -> service.addProduct(userId, 1L, 0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Quantity must be > 0");
    }

    @Test
    void updateQuantity_changesAmountOrRemovesItem() {
        Cart cart = Cart.builder().id(11L).user(user).items(new ArrayList<>()).build();
        Product product = Product.builder().id(2L).name("Flash Cards").build();
        CartItem item = CartItem.builder().id(4L).cart(cart).product(product).quantity(2).build();
        cart.getItems().add(item);

        when(cartRepository.findByIdWithItems(cart.getId())).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(item.getId())).thenReturn(Optional.of(item));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartItemRepository.save(item)).thenReturn(item);

        Cart updated = service.updateQuantity(cart.getId(), item.getId(), 5);
        assertThat(updated.getItems().get(0).getQuantity()).isEqualTo(5);

        service.updateQuantity(cart.getId(), item.getId(), 0);
        assertThat(cart.getItems()).isEmpty();
        verify(cartItemRepository).delete(item);
    }

    @Test
    void removeItem_deletesEntry() {
        Cart cart = Cart.builder().id(6L).user(user).items(new ArrayList<>()).build();
        CartItem item = CartItem.builder().id(7L).cart(cart).product(Product.builder().id(3L).build()).quantity(1).build();
        cart.getItems().add(item);

        when(cartRepository.findByIdWithItems(cart.getId())).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(item.getId())).thenReturn(Optional.of(item));

        Cart updated = service.removeItem(cart.getId(), item.getId());

        assertThat(updated.getItems()).isEmpty();
        verify(cartItemRepository).delete(item);
    }

    @Test
    void clearCart_removesAllItems() {
        Cart cart = Cart.builder().id(10L).user(user).items(new ArrayList<>()).build();
        cart.getItems().add(CartItem.builder().id(1L).cart(cart).product(Product.builder().id(1L).build()).quantity(1).build());
        when(cartRepository.findByIdWithItems(cart.getId())).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);

        service.clearCart(cart.getId());

        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void getCart_notFoundThrows() {
        when(cartRepository.findByIdWithItems(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getCart(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cart not found");
    }

    @Test
    void getOrCreateCartByUser_returnsExistingOrCreatesNew() {
        Cart existing = Cart.builder().id(2L).user(user).items(new ArrayList<>()).build();
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserWithItems(user)).thenReturn(Optional.of(existing));

        assertThat(service.getOrCreateCartByUser(userId)).isEqualTo(existing);

        when(cartRepository.findByUserWithItems(user)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(existing);
        assertThat(service.getOrCreateCartByUser(userId)).isEqualTo(existing);
    }

    private User baseUser(UUID id) {
        User u = new User();
        u.setId(id);
        u.setEmail("user" + id + "@test.com");
        u.setName("Test");
        u.setPassword("pw");
        u.setRole(Role.PATIENT);
        u.setGender(com.example.backend.models.Gender.OTHER);
        return u;
    }
}
