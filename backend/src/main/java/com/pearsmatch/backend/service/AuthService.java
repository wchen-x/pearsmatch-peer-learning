package com.pearsmatch.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pearsmatch.backend.dto.LoginRequest;
import com.pearsmatch.backend.dto.RegisterRequest;
import com.pearsmatch.backend.dto.UserResponse;
import com.pearsmatch.backend.model.User;
import com.pearsmatch.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User(email, passwordHash, request.getName().trim());

        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser);
    }

    public UserResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        return new UserResponse(user);
    }
}
