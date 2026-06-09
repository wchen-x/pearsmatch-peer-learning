package com.pearsmatch.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pearsmatch.backend.dto.UpdateProfileRequest;
import com.pearsmatch.backend.dto.UserResponse;
import com.pearsmatch.backend.model.User;
import com.pearsmatch.backend.repository.UserRepository;
import com.pearsmatch.backend.service.JwtService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponse(user);
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUser(
        @RequestHeader("Authorization") String authHeader, 
        @RequestBody UpdateProfileRequest request
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUniversity(request.getUniversity());
        user.setCourse(request.getCourse());
        user.setYearOfStudy(request.getYearOfStudy());
        user.setBio(request.getBio());

        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser);
    }
}