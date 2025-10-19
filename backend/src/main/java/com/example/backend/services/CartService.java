package com.example.backend.services;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.models.Cart;
import com.example.backend.models.CartItem;
import com.example.backend.models.Product;
import com.example.backend.models.User;
import com.example.backend.repositories.CartItemRepository;
import com.example.backend.repositories.CartRepository;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.UserRepo;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepo userRepository;

    public CartService(CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepo userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Cart getCart(Long cartId) {
        return cartRepository.findByIdWithItems(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    public Cart createCart(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUserWithItems(user).orElseGet(() -> {
            Cart cart = Cart.builder()
                    .user(user)
                    .items(new java.util.ArrayList<>())
                    .build();
            return cartRepository.save(cart);
        });
    }

    public Cart addProduct(UUID userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be > 0");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get or create user's cart (with items fetched)
        Cart cart = cartRepository.findByUserWithItems(user).orElseGet(() -> {
            Cart newCart = Cart.builder()
                    .user(user)
                    .items(new java.util.ArrayList<>())
                    .build();
            return cartRepository.save(newCart);
        });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update existing item if present
        CartItem existing = cart.getItems().stream()
                .filter(it -> it.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
        // Return a fully initialized cart for JSON
        return cartRepository.findByIdWithItems(cart.getId()).orElse(cart);
    }

    public Cart updateQuantity(Long cartId, Long itemId, int quantity) {
        Cart cart = getCart(cartId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        cartRepository.save(cart);
        return cartRepository.findByIdWithItems(cart.getId()).orElse(cart);
    }

    public Cart removeItem(Long cartId, Long itemId) {
        Cart cart = getCart(cartId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);
        return cartRepository.findByIdWithItems(cart.getId()).orElse(cart);
    }

    public void clearCart(Long cartId) {
        Cart cart = getCart(cartId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public Cart getOrCreateCartByUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return cartRepository.findByUserWithItems(user).orElseGet(() -> {
            Cart cart = Cart.builder()
                    .user(user)
                    .items(new java.util.ArrayList<>())
                    .build();
            return cartRepository.save(cart);
        });
    }
}
