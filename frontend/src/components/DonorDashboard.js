import React, { useEffect, useMemo, useState } from "react";

export default function DonorDashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [donateAmount, setDonateAmount] = useState(10);

  const canDonate = useMemo(() => Number(donateAmount) > 0 && !loading, [donateAmount, loading]);

  async function refresh() {
    const res = await fetch("/api/emergencies");
    const data = await res.json();
    setEmergencies(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const fundEmergency = async (id) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/emergencies/${id}/fund`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: Number(donateAmount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fund emergency");
      setSuccess(`Funded ${id} with ${donateAmount}`);
      await refresh();
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-semibold">Donor Dashboard</h2>

      {error && <div className="rounded bg-red-50 text-red-700 p-3">{error}</div>}
      {success && <div className="rounded bg-green-50 text-green-700 p-3">{success}</div>}

      <div className="flex items-center gap-3">
        <input
          type="number"
          className="border rounded px-3 py-2 w-40"
          value={donateAmount}
          min={1}
          onChange={(e) => setDonateAmount(e.target.value)}
        />
        <span className="text-gray-600">Set donation amount</span>
      </div>

      <ul className="space-y-3">
        {emergencies.map((e) => (
          <li key={e.id} className="border rounded p-4 flex justify-between items-center bg-white">
            <div>
              <div className="font-medium">{e.patientName || "Unknown Patient"}</div>
              <div className="text-sm text-gray-600">Requested: {e.requestedAmount} · Funded: {e.fundedAmount || 0}</div>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={() => fundEmergency(e.id)}
              disabled={!canDonate}
            >
              {loading ? "Funding..." : "Fund"}
            </button>
          </li>
        ))}
        {emergencies.length === 0 && <li className="text-gray-500">No emergencies yet</li>}
      </ul>
    </div>
  );
}
