package com.pearsmatch.backend.controller;

import com.pearsmatch.backend.model.*;
import com.pearsmatch.backend.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
