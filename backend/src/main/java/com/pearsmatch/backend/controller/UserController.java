package com.pearsmatch.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pearsmatch.backend.dto.AddUserSkillRequest;
import com.pearsmatch.backend.dto.MatchResponse;
import com.pearsmatch.backend.dto.UpdateProfileRequest;
import com.pearsmatch.backend.dto.UserResponse;
import com.pearsmatch.backend.dto.UserSkillResponse;
import com.pearsmatch.backend.model.Skill;
import com.pearsmatch.backend.model.SkillType;
import com.pearsmatch.backend.model.User;
import com.pearsmatch.backend.model.UserSkill;
import com.pearsmatch.backend.repository.SkillRepository;
import com.pearsmatch.backend.repository.UserRepository;
import com.pearsmatch.backend.repository.UserSkillRepository;
import com.pearsmatch.backend.service.JwtService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

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

    public UserController(
        UserRepository userRepository, 
        JwtService jwtService,
        SkillRepository skillRepository,
        UserSkillRepository userSkillRepository
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromAuthHeader(authHeader);

        return new UserResponse(user);
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUser(
        @RequestHeader("Authorization") String authHeader, 
        @RequestBody UpdateProfileRequest request
    ) {
        User user = getUserFromAuthHeader(authHeader);

        user.setUniversity(request.getUniversity());
        user.setCourse(request.getCourse());
        user.setYearOfStudy(request.getYearOfStudy());
        user.setBio(request.getBio());

        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser);
    }

    @PostMapping("/me/skills")
    public UserSkillResponse addCurrentUserSkill(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody AddUserSkillRequest request
    ) {
        User user = getUserFromAuthHeader(authHeader);

        String skillName = request.getSkillName().toLowerCase().trim();

        Skill skill = skillRepository.findByName(skillName)
            .orElseGet(() -> skillRepository.save(new Skill(skillName)));

        UserSkill userSkill = new UserSkill(
            user,
            skill,
            request.getType(),
            request.getLevel()
        );

        UserSkill savedUserSkill = userSkillRepository.save(userSkill);

        return new UserSkillResponse(savedUserSkill);
    }

    @GetMapping("/me/skills")
    public List<UserSkillResponse> getCurrentUserSkills(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromAuthHeader(authHeader);

        return userSkillRepository.findByUser(user)
            .stream()
            .map(UserSkillResponse::new)
            .toList();
    }

    @GetMapping("/matches")
    public List<MatchResponse> getMatches(@RequestHeader("Authorization") String authHeader) {
        User currentUser = getUserFromAuthHeader(authHeader);

        List<UserSkill> skillsToLearn = userSkillRepository.findByUserAndType(
            currentUser,
            SkillType.LEARN
        );

        Map<User, List<String>> matchedUsers = new HashMap<>();

        for (UserSkill learnSkill : skillsToLearn) {
            List<UserSkill> teachers = userSkillRepository.findBySkillAndType(
                learnSkill.getSkill(),
                SkillType.TEACH
            );

            for (UserSkill teacherSkill : teachers) {
                User teacher = teacherSkill.getUser();

                if (teacher.getId().equals(currentUser.getId())) {
                    continue;
                }

                matchedUsers
                    .computeIfAbsent(teacher, key -> new ArrayList<>())
                    .add(learnSkill.getSkill().getName());
            }
        }

        return matchedUsers.entrySet()
            .stream()
            .map(entry -> new MatchResponse(entry.getKey(), entry.getValue()))
            .toList();
    }

    @DeleteMapping("/me/skills/{skillId}")
    public void deleteCurrentUserSkill(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable Long skillId
    ) {
        User user = getUserFromAuthHeader(authHeader);

        UserSkill userSkill = userSkillRepository.findById(skillId)
            .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!userSkill.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own skills");
        }

        userSkillRepository.delete(userSkill);
    }
}