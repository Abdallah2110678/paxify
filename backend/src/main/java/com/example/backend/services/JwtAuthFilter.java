package com.example.backend.services;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepo;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepo userRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException, java.io.IOException {
        final String authHeader = request.getHeader("Authorization");
        // removed noisy debug logging
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String email = null;
        try {
            email = jwtService.extractUsername(token);
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            // Token expired -> return 401 so client can re-login
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            try { response.getWriter().write("JWT expired"); } catch (Exception ignored) {}
            return;
        } catch (Exception ex) {
            // Any other parsing error -> 401
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            try { response.getWriter().write("Invalid JWT"); } catch (Exception ignored) {}
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userRepo.findByEmail(email).orElse(null);

            if (user != null && jwtService.isTokenValid(token, user)) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities() // <--- this includes ADMIN/DOCTOR/PATIENT
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
                // removed noisy debug logging
            }
        }
        filterChain.doFilter(request, response);
    }
}
