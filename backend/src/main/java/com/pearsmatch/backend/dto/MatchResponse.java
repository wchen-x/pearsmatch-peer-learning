package com.pearsmatch.backend.dto;

import java.util.List;

import com.pearsmatch.backend.model.User;

public class MatchResponse {
    private Long userId;
    private String name;
    private String university;
    private String course;
    private Integer yearOfStudy;
    private String bio;
    private List<String> matchingSkills;

    public MatchResponse(User user, List<String> matchingSkills) {
        this.userId = user.getId();
        this.name = user.getName();
        this.university = user.getUniversity();
        this.course = user.getCourse();
        this.yearOfStudy = user.getYearOfStudy();
        this.bio = user.getBio();
        this.matchingSkills = matchingSkills;
    }

    public Long getUserId() {
        return userId;
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

    public List<String> getMatchingSkills() {
        return matchingSkills;
    }
}