package com.pearsmatch.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pearsmatch.backend.model.Skill;
import com.pearsmatch.backend.model.SkillType;
import com.pearsmatch.backend.model.User;
import com.pearsmatch.backend.model.UserSkill;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    List<UserSkill> findByUserAndType(User user, SkillType type);
    List<UserSkill> findBySkillAndType(Skill skill, SkillType type);
}
