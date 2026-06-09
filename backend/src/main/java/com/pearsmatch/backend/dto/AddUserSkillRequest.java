package com.pearsmatch.backend.dto;

import com.pearsmatch.backend.model.SkillLevel;
import com.pearsmatch.backend.model.SkillType;

public class AddUserSkillRequest {
    private String skillName;
    private SkillType type;
    private SkillLevel level;

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public SkillType getType() {
        return type;
    }

    public void setType(SkillType type) {
        this.type = type;
    }

    public SkillLevel getLevel() {
        return level;
    }

    public void setLevel(SkillLevel level) {
        this.level = level;
    }
}