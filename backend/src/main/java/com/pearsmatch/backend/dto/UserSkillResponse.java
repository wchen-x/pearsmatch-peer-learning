package com.pearsmatch.backend.dto;

import com.pearsmatch.backend.model.UserSkill;

public class UserSkillResponse {
    private Long id;
    private String skillName;
    private String type;
    private String level;

    public UserSkillResponse(UserSkill userSkill) {
        this.id = userSkill.getId();
        this.skillName = userSkill.getSkill().getName();
        this.type = userSkill.getType().name();
        this.level = userSkill.getLevel().name();
    }

    public Long getId() {
        return id;
    }

    public String getSkillName() {
        return skillName;
    }

    public String getType() {
        return type;
    }

    public String getLevel() {
        return level;
    }
}