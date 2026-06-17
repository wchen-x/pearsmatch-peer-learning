import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import type { User } from "../types/auth";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiRequest<User>("/api/me");
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  if (isLoading) {
    return <p className="text-gray-600">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name} 🍐</h1>
        <p className="mt-2 text-gray-600">
          Manage your profile, skills, matches, and connections.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            {user.university || "No university added yet"}
          </p>
          <p className="text-sm text-gray-600">
            {user.course || "No course added yet"}
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-block font-medium text-green-700"
          >
            Edit profile
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Skills</h2>
          <p className="mt-2 text-sm text-gray-600">
            Add what you can teach and what you want to learn.
          </p>
          <Link
            to="/skills"
            className="mt-4 inline-block font-medium text-green-700"
          >
            Manage skills
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Matches</h2>
          <p className="mt-2 text-sm text-gray-600">
            Find students who can help with your learning goals.
          </p>
          <Link
            to="/matches"
            className="mt-4 inline-block font-medium text-green-700"
          >
            View matches
          </Link>
        </div>
      </div>
    </div>
  );
}