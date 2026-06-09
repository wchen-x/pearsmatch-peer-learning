package com.pearsmatch.backend.repository;

import com.pearsmatch.backend.model.SkillType;
import com.pearsmatch.backend.model.User;
import com.pearsmatch.backend.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    List<UserSkill> findByUserAndType(User user, SkillType type);
}
