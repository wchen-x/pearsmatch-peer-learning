package com.pearsmatch.backend.dto;

import com.pearsmatch.backend.model.User;

public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String university;
    private String course;
    private Integer yearOfStudy;
    private String bio;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.university = user.getUniversity();
        this.course = user.getCourse();
        this.yearOfStudy = user.getYearOfStudy();
        this.bio = user.getBio();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getUniversity() {
        return university;
    }

    public String getCourse() {
        return course;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public String getBio() {
        return bio;
    }
}
