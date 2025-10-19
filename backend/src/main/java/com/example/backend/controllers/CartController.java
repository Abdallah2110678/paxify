package com.example.backend.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.backend.models.Cart;
import com.example.backend.models.User;
import com.example.backend.services.CartService;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Add product for the currently authenticated user
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/add/{productId}")
    public Cart addProduct(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @RequestParam int quantity) {
        return cartService.addProduct(user.getId(), productId, quantity);
    }

    // Get (or create) cart for the current user
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/by-user")
    public Cart getOrCreateForCurrentUser(@AuthenticationPrincipal User user) {
        return cartService.getOrCreateCartByUser(user.getId());
    }

    // Get a cart by id (useful if you already know cartId)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{cartId}")
    public Cart getCart(@PathVariable Long cartId) {
        return cartService.getCart(cartId);
    }

    // Set absolute quantity for a cart item (0 removes it)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{cartId}/update/{itemId}")
    public Cart updateQuantity(
            @PathVariable Long cartId,
            @PathVariable Long itemId,
            @RequestParam int quantity) {
        return cartService.updateQuantity(cartId, itemId, quantity);
    }

    // Remove a single item from the cart
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{cartId}/remove/{itemId}")
    public Cart removeItem(@PathVariable Long cartId, @PathVariable Long itemId) {
        return cartService.removeItem(cartId, itemId);
    }

    // Clear the entire cart
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{cartId}/clear")
    public void clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);
    }
}
