package com.pearsmatch.backend.dto;

import com.pearsmatch.backend.model.Connection;

public class ConnectionResponse {
    private Long id;
    private UserResponse sender;
    private UserResponse receiver;
    private String status;

    public ConnectionResponse(Connection connection) {
        this.id = connection.getId();
        this.sender = new UserResponse(connection.getSender());
        this.receiver = new UserResponse(connection.getReceiver());
        this.status = connection.getStatus().name();
    }

    public Long getId() {
        return id;
    }

    public UserResponse getSender() {
        return sender;
    }

    public UserResponse getReceiver() {
        return receiver;
    }

    public String getStatus() {
        return status;
    }
}