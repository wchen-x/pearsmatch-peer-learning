import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "../api/client";

type SkillType = "TEACH" | "LEARN";
type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type UserSkill = {
  id: number;
  skillName: string;
  type: SkillType;
  level: SkillLevel;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<UserSkill[]>([]);

  const [skillName, setSkillName] = useState("");
  const [type, setType] = useState<SkillType>("TEACH");
  const [level, setLevel] = useState<SkillLevel>("BEGINNER");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  async function loadSkills() {
    try {
      const data = await apiRequest<UserSkill[]>("/api/me/skills");
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsAdding(true);

    try {
      const newSkill = await apiRequest<UserSkill>("/api/me/skills", {
        method: "POST",
        body: JSON.stringify({
          skillName,
          type,
          level,
        }),
      });

      setSkills((currentSkills) => [...currentSkills, newSkill]);
      setSkillName("");
      setType("TEACH");
      setLevel("BEGINNER");
      setMessage("Skill added successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add skill");
    } finally {
      setIsAdding(false);
    }
  }

  const teachingSkills = skills.filter((skill) => skill.type === "TEACH");
  const learningSkills = skills.filter((skill) => skill.type === "LEARN");

  if (isLoading) {
    return <p className="text-gray-600">Loading skills...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your skills 🍐</h1>
        <p className="mt-2 text-gray-600">
          Add what you can teach and what you want to learn.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Add a skill</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Skill name</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={skillName}
              onChange={(event) => setSkillName(event.target.value)}
              placeholder="e.g. Python, SQL, Guitar"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={type}
              onChange={(event) => setType(event.target.value as SkillType)}
            >
              <option value="TEACH">Can teach</option>
              <option value="LEARN">Want to learn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Level</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={level}
              onChange={(event) => setLevel(event.target.value as SkillLevel)}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <button
              disabled={isAdding}
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-60"
            >
              {isAdding ? "Adding..." : "Add skill"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">I can teach</h2>

          {teachingSkills.length === 0 ? (
            <p className="mt-3 text-sm text-gray-600">
              No teaching skills added yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {teachingSkills.map((skill) => (
                <li
                  key={skill.id}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  <span className="font-medium capitalize">
                    {skill.skillName}
                  </span>{" "}
                  <span className="text-gray-500">- {skill.level}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">I want to learn</h2>

          {learningSkills.length === 0 ? (
            <p className="mt-3 text-sm text-gray-600">
              No learning skills added yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {learningSkills.map((skill) => (
                <li
                  key={skill.id}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  <span className="font-medium capitalize">
                    {skill.skillName}
                  </span>{" "}
                  <span className="text-gray-500">- {skill.level}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}