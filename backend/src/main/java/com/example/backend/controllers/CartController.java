package com.example.backend.controllers;


import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.Cart;
import com.example.backend.services.CartService;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "*")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public Cart createCart(@RequestParam UUID userId) {
        return cartService.createCart(userId);
    }

    @GetMapping("/{cartId}")
    public Cart getCart(@PathVariable Long cartId) {
        return cartService.getCart(cartId);
    }

    @PostMapping("/{cartId}/add/{productId}")
    public Cart addProduct(@PathVariable Long cartId,
            @PathVariable Long productId,
            @RequestParam int quantity) {
        return cartService.addProduct(cartId, productId, quantity);
    }

    @PutMapping("/{cartId}/update/{itemId}")
    public Cart updateQuantity(@PathVariable Long cartId,
            @PathVariable Long itemId,
            @RequestParam int quantity) {
        return cartService.updateQuantity(cartId, itemId, quantity);
    }

    @DeleteMapping("/{cartId}/remove/{itemId}")
    public Cart removeItem(@PathVariable Long cartId, @PathVariable Long itemId) {
        return cartService.removeItem(cartId, itemId);
    }

    @DeleteMapping("/{cartId}/clear")
    public void clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);
    }
}
