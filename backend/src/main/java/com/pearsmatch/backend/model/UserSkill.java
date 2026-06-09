package com.pearsmatch.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "user_skills",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "skill_id", "type"})
    }
)
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillLevel level;

    public UserSkill() {}

    public UserSkill(User user, Skill skill, SkillType type, SkillLevel level) {
        this.user = user;
        this.skill = skill;
        this.type = type;
        this.level = level;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Skill getSkill() {
        return skill;
    }

    public SkillType getType() {
        return type;
    }

    public SkillLevel getLevel() {
        return level;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public void setType(SkillType type) {
        this.type = type;
    }

    public void setLevel(SkillLevel level) {
        this.level = level;
    }
}
