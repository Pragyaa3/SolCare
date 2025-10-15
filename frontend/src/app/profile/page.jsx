"use client";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [loans, setLoans] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [repayAmount, setRepayAmount] = useState(25);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    const [lr, ar] = await Promise.all([
      fetch("/api/loans"),
      fetch("/api/appointments"),
    ]);
    setLoans(await lr.json());
    setAppointments(await ar.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  const repay = async () => {
    if (!selectedLoan) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/loans/${selectedLoan}/repay`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: Number(repayAmount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to repay");
      setMessage(`Repaid ${repayAmount} on ${selectedLoan}`);
      await refresh();
    } catch (e) {
      setMessage(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-semibold">Profile</h2>

      <section className="rounded border bg-white p-6 space-y-3">
        <h3 className="text-xl font-medium">Loans</h3>
        <div className="flex items-center gap-3 mb-3">
          <select className="border rounded px-3 py-2" value={selectedLoan} onChange={(e) => setSelectedLoan(e.target.value)}>
            <option value="">Select loan</option>
            {loans.map((l) => (
              <option key={l.id} value={l.id}>{l.id} · {l.amount}</option>
            ))}
          </select>
          <input type="number" className="border rounded px-3 py-2 w-32" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} />
          <button className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50" onClick={repay} disabled={!selectedLoan || loading}>
            {loading ? "Repaying..." : "Repay"}
          </button>
        </div>
        <ul className="space-y-2">
          {loans.map((l) => (
            <li key={l.id} className="flex justify-between border rounded p-2">
              <span>{l.id}</span>
              <span className="text-gray-600">amount {l.amount} · repaid {l.repaid} · score {l.creditScore}</span>
            </li>
          ))}
          {loans.length === 0 && <li className="text-gray-500">No loans</li>}
        </ul>
      </section>

      <section className="rounded border bg-white p-6 space-y-3">
        <h3 className="text-xl font-medium">Appointments</h3>
        <ul className="space-y-2">
          {appointments.map((a) => (
            <li key={a.id} className="flex justify-between border rounded p-2">
              <span>{a.date} · {a.reason}</span>
              <span className="text-gray-600">{a.userId}</span>
            </li>
          ))}
          {appointments.length === 0 && <li className="text-gray-500">No appointments</li>}
        </ul>
      </section>

      {message && <div className="rounded bg-blue-50 text-blue-700 p-3">{message}</div>}
    </div>
  );
}