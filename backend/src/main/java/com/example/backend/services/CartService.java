package com.example.backend.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.backend.models.Cart;
import com.example.backend.models.CartItem;
import com.example.backend.models.Product;
import com.example.backend.models.User;
import com.example.backend.repositories.CartItemRepository;
import com.example.backend.repositories.CartRepository;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.UserRepo;

@Service
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
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    public Cart createCart(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = Cart.builder()
                .user(user)
                .build();

        return cartRepository.save(cart);
    }

    public Cart addProduct(Long cartId, Long productId, int quantity) {
        Cart cart = getCart(cartId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                item.setQuantity(item.getQuantity() + quantity);
                cartItemRepository.save(item);
                return cartRepository.save(cart);
            }
        }

        CartItem item = CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(quantity)
                .build();
        cart.getItems().add(item);
        cartItemRepository.save(item);

        return cartRepository.save(cart);
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
        return cartRepository.save(cart);
    }

    public Cart removeItem(Long cartId, Long itemId) {
        Cart cart = getCart(cartId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return cartRepository.save(cart);
    }

    public void clearCart(Long cartId) {
        Cart cart = getCart(cartId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}