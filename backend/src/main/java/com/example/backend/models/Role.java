package com.example.backend.models;

import java.util.Arrays;
import java.util.Locale;

public enum Role {
    ADMIN("ADMIN"),
    DOCTOR("DOCTOR"),
    PATIENT("PATIENT");

    
    private final String value;

    Role(String value) { this.value = value; }

    public String getValue() { return value; }

    // ✅ Map input like "admin", "ADMIN", etc. to the enum
    public static Role fromString(String s) {
        if (s == null) throw new IllegalArgumentException("role is null");
        String v = s.trim().toUpperCase(Locale.ROOT);
        return Arrays.stream(values())
                .filter(r -> r.name().equals(v) || r.value.equals(v))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown role: " + s));
    }
}
