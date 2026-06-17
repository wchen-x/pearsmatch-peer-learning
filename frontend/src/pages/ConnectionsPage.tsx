import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import type { User } from "../types/auth";

type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

type Connection = {
  id: number;
  sender: User;
  receiver: User;
  status: ConnectionStatus;
};

export default function ConnectionsPage() {
  const [received, setReceived] = useState<Connection[]>([]);
  const [sent, setSent] = useState<Connection[]>([]);
  const [accepted, setAccepted] = useState<Connection[]>([]);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function loadConnections() {
    try {
      const [receivedData, sentData, acceptedData] = await Promise.all([
        apiRequest<Connection[]>("/api/connections/received"),
        apiRequest<Connection[]>("/api/connections/sent"),
        apiRequest<Connection[]>("/api/connections/accepted"),
      ]);

      setReceived(receivedData);
      setSent(sentData);
      setAccepted(acceptedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load connections");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadConnections();
  }, []);

  async function updateConnection(connectionId: number, action: "accept" | "reject") {
    setError("");
    setMessage("");
    setUpdatingId(connectionId);

    try {
      await apiRequest<Connection>(`/api/connections/${connectionId}/${action}`, {
        method: "PUT",
      });

      setMessage(`Request ${action === "accept" ? "accepted" : "rejected"}.`);
      await loadConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} request`);
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading connections...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connections 🍐</h1>
        <p className="mt-2 text-gray-600">
          Manage your sent, received, and accepted connection requests.
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

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Received requests</h2>

        {received.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">No received requests yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {received.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{connection.sender.name}</p>
                  <p className="text-sm text-gray-600">
                    {connection.sender.course || "Course not added"} ·{" "}
                    {connection.status}
                  </p>
                </div>

                {connection.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateConnection(connection.id, "accept")}
                      disabled={updatingId === connection.id}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateConnection(connection.id, "reject")}
                      disabled={updatingId === connection.id}
                      className="rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Sent requests</h2>

        {sent.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">No sent requests yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {sent.map((connection) => (
              <div key={connection.id} className="rounded-lg border p-4">
                <p className="font-medium">{connection.receiver.name}</p>
                <p className="text-sm text-gray-600">
                  Status: {connection.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Accepted connections</h2>

        {accepted.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">
            No accepted connections yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {accepted.map((connection) => (
              <div key={connection.id} className="rounded-lg border p-4">
                <p className="font-medium">
                  {connection.sender.name} ↔ {connection.receiver.name}
                </p>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}