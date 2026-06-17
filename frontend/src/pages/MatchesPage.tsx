import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

type Match = {
  userId: number;
  name: string;
  university: string | null;
  course: string | null;
  yearOfStudy: number | null;
  bio: string | null;
  matchingSkills: string[];
};

type ConnectionResponse = {
  id: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [requestingUserId, setRequestingUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await apiRequest<Match[]>("/api/matches");
        setMatches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load matches");
      } finally {
        setIsLoading(false);
      }
    }

    loadMatches();
  }, []);

  async function sendRequest(userId: number) {
    setError("");
    setMessage("");
    setRequestingUserId(userId);

    try {
      await apiRequest<ConnectionResponse>(`/api/connections/request/${userId}`, {
        method: "POST",
      });

      setMessage("Connection request sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request");
    } finally {
      setRequestingUserId(null);
    }
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading matches...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your matches 🍐</h1>
        <p className="mt-2 text-gray-600">
          Find students who can teach the skills you want to learn.
        </p>
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

      {matches.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">No matches yet</h2>
          <p className="mt-2 text-gray-600">
            Add skills you want to learn, then check back for students who can
            teach them.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <div key={match.userId} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{match.name}</h2>

              <p className="mt-1 text-sm text-gray-600">
                {match.course || "Course not added"}
                {match.yearOfStudy ? `, Year ${match.yearOfStudy}` : ""}
              </p>

              <p className="text-sm text-gray-600">
                {match.university || "University not added"}
              </p>

              {match.bio && (
                <p className="mt-3 text-sm text-gray-700">{match.bio}</p>
              )}

              <div className="mt-4">
                <p className="text-sm font-medium">Can help with:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {match.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => sendRequest(match.userId)}
                disabled={requestingUserId === match.userId}
                className="mt-5 rounded-lg bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-60"
              >
                {requestingUserId === match.userId
                  ? "Sending..."
                  : "Send request"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}