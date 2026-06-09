package com.pearsmatch.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pearsmatch.backend.model.Skill;
import com.pearsmatch.backend.model.SkillLevel;
import com.pearsmatch.backend.model.SkillType;
import com.pearsmatch.backend.model.User;
import com.pearsmatch.backend.model.UserSkill;
import com.pearsmatch.backend.repository.SkillRepository;
import com.pearsmatch.backend.repository.UserRepository;
import com.pearsmatch.backend.repository.UserSkillRepository;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    public TestController(
            UserRepository userRepository,
            SkillRepository skillRepository,
            UserSkillRepository userSkillRepository
    ) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @PostMapping("/user")
    public User createUser() {
        User user = new User(
                "chen@example.com",
                "fake-hashed-password",
                "Chen"
        );

        user.setUniversity("King's College London");
        user.setCourse("Computer Science");
        user.setYearOfStudy(2);
        user.setBio("I can teach Java and want to learn SQL.");

        return userRepository.save(user);
    }

    @PostMapping("/skill")
    public Skill createSkill() {
        Skill skill = new Skill("Java");
        return skillRepository.save(skill);
    }

    @PostMapping("/user-skill")
    public UserSkill createUserSkill() {
        User user = userRepository.findByEmail("chen@example.com")
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findByName("java")
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        UserSkill userSkill = new UserSkill(
                user,
                skill,
                SkillType.TEACH,
                SkillLevel.INTERMEDIATE
        );

        return userSkillRepository.save(userSkill);
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/skills")
    public List<Skill> getSkills() {
        return skillRepository.findAll();
    }

    @GetMapping("/user-skills")
    public List<UserSkill> getUserSkills() {
        return userSkillRepository.findAll();
    }
}
