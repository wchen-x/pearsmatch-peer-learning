import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import type { User } from "../types/auth";

export default function ProfilePage() {
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [bio, setBio] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await apiRequest<User>("/api/me");

        setUniversity(user.university || "");
        setCourse(user.course || "");
        setYearOfStudy(user.yearOfStudy ? String(user.yearOfStudy) : "");
        setBio(user.bio || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      await apiRequest<User>("/api/me", {
        method: "PUT",
        body: JSON.stringify({
          university,
          course,
          yearOfStudy: yearOfStudy ? Number(yearOfStudy) : null,
          bio,
        }),
      });

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Edit your profile 🍐</h1>
      <p className="mt-2 text-gray-600">
        Tell other students a little about your course and what you’re looking for.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">University</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={university}
            onChange={(event) => setUniversity(event.target.value)}
            placeholder="Your university"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Course</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            placeholder="Your course"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Year of study</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            type="number"
            min="1"
            max="10"
            value={yearOfStudy}
            onChange={(event) => setYearOfStudy(event.target.value)}
            placeholder="e.g. 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            className="mt-1 min-h-28 w-full rounded-lg border px-3 py-2"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Tell others what you can help with and what you want to learn."
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        )}

        <button
          disabled={isSaving}
          className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}