package com.pearsmatch.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pearsmatch.backend.dto.ConnectionResponse;
import com.pearsmatch.backend.model.Connection;
import com.pearsmatch.backend.model.ConnectionStatus;
import com.pearsmatch.backend.model.User;
import com.pearsmatch.backend.repository.ConnectionRepository;
import com.pearsmatch.backend.repository.UserRepository;
import com.pearsmatch.backend.service.JwtService;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public ConnectionController(
        ConnectionRepository connectionRepository,
        UserRepository userRepository,
        JwtService jwtService
    ) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    private User getUserFromAuthHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String email = jwtService.extractEmail(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/request/{receiverId}")
    public ConnectionResponse sendConnectionRequest(@RequestHeader("Authorization") String authHeader, @PathVariable Long receiverId) {
        User sender = getUserFromAuthHeader(authHeader);

        User receiver = userRepository.findById(receiverId)
            .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("You cannot connect with yourself");
        }

        if (connectionRepository.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new RuntimeException("Connection request already exists");
        }

        Connection connection = new Connection(sender, receiver);
        Connection savedConnection = connectionRepository.save(connection);

        return new ConnectionResponse(savedConnection);
    }

    @GetMapping("/sent")
    public List<ConnectionResponse> getSentConnections(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromAuthHeader(authHeader);

        return connectionRepository.findBySender(user)
            .stream()
            .map(ConnectionResponse::new)
            .toList();
    }

    @GetMapping("/received")
    public List<ConnectionResponse> getReceivedConnections(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromAuthHeader(authHeader);

        return connectionRepository.findByReceiver(user)
            .stream()
            .map(ConnectionResponse::new)
            .toList();
    }

    @PutMapping("/{connectionId}/accept")
    public ConnectionResponse acceptConnection(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable Long connectionId
    ) {
        User user = getUserFromAuthHeader(authHeader);

        Connection connection = connectionRepository.findById(connectionId)
            .orElseThrow(() -> new RuntimeException("Connection not found"));

        if (!connection.getReceiver().getId().equals(user.getId())) {
            throw new RuntimeException("Only the receiver can accept this request");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);

        Connection savedConnection = connectionRepository.save(connection);

        return new ConnectionResponse(savedConnection);
    }

    @PutMapping("/{connectionId}/reject")
    public ConnectionResponse rejectConnection(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable Long connectionId
    ) {
        User user = getUserFromAuthHeader(authHeader);

        Connection connection = connectionRepository.findById(connectionId)
            .orElseThrow(() -> new RuntimeException("Connection not found"));

        if (!connection.getReceiver().getId().equals(user.getId())) {
            throw new RuntimeException("Only the receiver can reject this request");
        }

        connection.setStatus(ConnectionStatus.REJECTED);

        Connection savedConnection = connectionRepository.save(connection);

        return new ConnectionResponse(savedConnection);
    }
}