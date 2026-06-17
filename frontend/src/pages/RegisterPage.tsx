import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import type { AuthResponse } from "../types/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await apiRequest<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Create your account 🍐</h1>
      <p className="mt-2 text-gray-600">
        Start matching with students who can teach what you want to learn.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alice"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alice@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          disabled={isLoading}
          className="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-green-700">
          Login
        </Link>
      </p>
    </div>
  );
}