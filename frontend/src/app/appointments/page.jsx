"use client";
import React, { useEffect, useState } from "react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState("user-001");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function refresh() {
    const res = await fetch("/api/appointments");
    const data = await res.json();
    setAppointments(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const createAppointment = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, date, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create appointment");
      setSuccess(`Appointment created for ${date}`);
      setDate("");
      setReason("");
      await refresh();
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-semibold">Appointments</h2>
      {error && <div className="rounded bg-red-50 text-red-700 p-3">{error}</div>}
      {success && <div className="rounded bg-green-50 text-green-700 p-3">{success}</div>}

      <section className="rounded border bg-white p-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input className="border rounded px-3 py-2" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <input type="date" className="border rounded px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={createAppointment}
          disabled={loading || !userId || !date || !reason}
        >
          {loading ? "Creating..." : "Create Appointment"}
        </button>
      </section>

      <ul className="space-y-3">
        {appointments.map((a) => (
          <li key={a.id} className="border rounded p-3 bg-white flex justify-between">
            <span>{a.userId} · {a.date} · {a.reason}</span>
            <span className="text-gray-500 text-sm">{new Date(a.createdAt).toLocaleString()}</span>
          </li>
        ))}
        {appointments.length === 0 && <li className="text-gray-500">No appointments yet</li>}
      </ul>
    </div>
  );
}