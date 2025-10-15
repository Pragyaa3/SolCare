import React, { useEffect, useState } from "react";

export default function HospitalDashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    const res = await fetch("/api/emergencies");
    const data = await res.json();
    setEmergencies(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const verifyEmergency = async (id) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ emergencyId: id, zkProof: "placeholder-proof" }),
      });
      const data = await res.json();
      setMessage(data.valid ? `Emergency ${id} is valid` : `Emergency ${id} failed verification`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-semibold">Hospital Dashboard</h2>
      {message && <div className="rounded bg-blue-50 text-blue-700 p-3">{message}</div>}
      <ul className="space-y-3">
        {emergencies.map((e) => (
          <li key={e.id} className="border rounded p-4 flex justify-between items-center bg-white">
            <div>
              <div className="font-medium">{e.patientName || "Unknown Patient"}</div>
              <div className="text-sm text-gray-600">Requested: {e.requestedAmount} · Funded: {e.fundedAmount || 0}</div>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={() => verifyEmergency(e.id)}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </li>
        ))}
        {emergencies.length === 0 && <li className="text-gray-500">No emergencies yet</li>}
      </ul>
    </div>
  );
}
