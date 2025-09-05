package com.example.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.UserResponse;
import com.example.backend.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class DoctorController {

    private final UserService userService;

    // Publicly list doctors for the Find Therapist page (no auth required)
    @GetMapping("/doctors")
    public ResponseEntity<List<UserResponse>> publicDoctors() {
        return ResponseEntity.ok(userService.listDoctors());
    }
}
