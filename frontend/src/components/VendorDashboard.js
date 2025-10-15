import React, { useEffect, useMemo, useState } from "react";

const currency = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(Number(n || 0));

export default function VendorDashboard() {
  const [loanAmount, setLoanAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loans, setLoans] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [requestedAmount, setRequestedAmount] = useState(250);
  const [document, setDocument] = useState(null);

  const canRequestLoan = useMemo(() => Number(loanAmount) > 0 && !loading, [loanAmount, loading]);
  const canPostEmergency = useMemo(
    () => !!patientName && Number(requestedAmount) > 0 && !loading,
    [patientName, requestedAmount, loading]
  );

  async function refreshLoans() {
    const res = await fetch("/api/loans");
    const data = await res.json();
    setLoans(data);
  }

  useEffect(() => {
    refreshLoans();
  }, []);

  const requestLoan = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: Number(loanAmount), borrower: "vendor-001" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to request loan");
      setSuccess(`Loan created for ${currency(data.amount)}`);
      await refreshLoans();
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const postEmergency = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const form = new FormData();
      form.set("patientName", patientName);
      form.set("requestedAmount", String(requestedAmount));
      if (document) form.set("document", document);
      const res = await fetch("/api/emergencies", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post emergency");
      setSuccess(`Emergency posted for ${data.patientName}`);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-semibold">Vendor Dashboard</h2>

      {error && <div className="rounded bg-red-50 text-red-700 p-3">{error}</div>}
      {success && <div className="rounded bg-green-50 text-green-700 p-3">{success}</div>}

      <section className="rounded-lg border bg-white p-6 space-y-4">
        <h3 className="text-xl font-medium">Request Micro-Loan</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            className="border rounded px-3 py-2 w-40"
            value={loanAmount}
            min={1}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={requestLoan}
            disabled={!canRequestLoan}
          >
            {loading ? "Processing..." : "Request Loan"}
          </button>
        </div>
        <div>
          <h4 className="font-medium mb-2">Your Recent Loans</h4>
          <ul className="space-y-2">
            {loans.map((l) => (
              <li key={l.id} className="flex justify-between border rounded p-2">
                <span>{l.id}</span>
                <span>
                  {currency(l.amount)} · repaid {currency(l.repaid)} · score {l.creditScore}
                </span>
              </li>
            ))}
            {loans.length === 0 && <li className="text-gray-500">No loans yet</li>}
          </ul>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 space-y-4">
        <h3 className="text-xl font-medium">Post Medical Emergency</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Patient name"
            className="border rounded px-3 py-2"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Requested amount"
            className="border rounded px-3 py-2"
            value={requestedAmount}
            min={1}
            onChange={(e) => setRequestedAmount(e.target.value)}
          />
          <input type="file" onChange={(e) => setDocument(e.target.files?.[0] || null)} />
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={postEmergency}
          disabled={!canPostEmergency}
        >
          {loading ? "Posting..." : "Post Emergency"}
        </button>
      </section>
    </div>
  );
}
