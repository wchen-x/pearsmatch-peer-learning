package com.pearsmatch.backend.controller;

import com.pearsmatch.backend.dto.LoginRequest;
import com.pearsmatch.backend.dto.RegisterRequest;
import com.pearsmatch.backend.dto.UserResponse;
import com.pearsmatch.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
