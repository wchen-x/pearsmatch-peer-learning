package com.pearsmatch.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pearsmatch.backend.model.Connection;
import com.pearsmatch.backend.model.User;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findBySender(User sender);
    List<Connection> findByReceiver(User receiver);
    Optional<Connection> findBySenderAndReceiver(User sender, User receiver);
}