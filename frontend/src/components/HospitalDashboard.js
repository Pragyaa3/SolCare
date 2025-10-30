"use client";
import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Activity, CheckCircle, Clock, Shield, TrendingUp, AlertCircle, Eye, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function HospitalDashboard() {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [verifiedCases, setVerifiedCases] = useState([]);

  const [pendingRequests] = useState([
    {
      id: 1,
      patient: "Ramesh Kumar",
      age: 45,
      condition: "Heart Surgery Required",
      amount: 5,
      submittedDate: "2024-01-15",
      documents: ["ECG Report", "Blood Test", "Doctor Recommendation"],
      aiScore: 94,
      urgency: "Critical"
    },
    {
      id: 2,
      patient: "Sunita Devi",
      age: 32,
      condition: "Cancer Treatment",
      amount: 8,
      submittedDate: "2024-01-16",
      documents: ["Biopsy Report", "CT Scan", "Oncologist Report"],
      aiScore: 98,
      urgency: "High"
    },
    {
      id: 3,
      patient: "Mohan Singh",
      age: 28,
      condition: "Accident - Multiple Fractures",
      amount: 3.5,
      submittedDate: "2024-01-17",
      documents: ["X-Ray", "Admission Form", "Police Report"],
      aiScore: 89,
      urgency: "Urgent"
    }
  ]);

  const verifyCase = async (requestId) => {
    if (!wallet.connected) {
      toast.error("Please connect your hospital wallet!");
      return;
    }

    const toastId = toast.loading("Verifying case...");
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const verified = pendingRequests.find(r => r.id === requestId);
      setVerifiedCases([...verifiedCases, { ...verified, verifiedDate: new Date().toLocaleDateString() }]);
      
      toast.success(
        <div>
          <p className="font-bold">Case Verified! ✅</p>
          <p className="text-sm">Case ID: {requestId}</p>
        </div>,
        { id: toastId, duration: 4000 }
      );
      
      setSelectedRequest(null);
    } catch (error) {
      toast.error(`Failed: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const getAiScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-slide-in">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Hospital Dashboard</h1>
          <p className="text-gray-600 text-lg">Verify emergency cases and manage fund withdrawals</p>
        </div>
        <WalletMultiButton />
      </div>

      {!wallet.connected ? (
        <div className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 rounded-3xl p-12 text-center border-2 border-dashed border-red-300 shadow-xl">
          <div className="text-7xl mb-6">🏥</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hospital Verification Portal</h2>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
            Connect your authorized hospital wallet to verify emergency cases
          </p>
          <WalletMultiButton />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
              <Clock size={32} className="text-red-600 mb-3" />
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{pendingRequests.length}</h3>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
              <CheckCircle size={32} className="text-green-600 mb-3" />
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{verifiedCases.length}</h3>
              <p className="text-gray-600 text-sm">Verified</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
              <TrendingUp size={32} className="text-blue-600 mb-3" />
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">47.5</h3>
              <p className="text-gray-600 text-sm">SOL Available</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
              <Shield size={32} className="text-purple-600 mb-3" />
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">96%</h3>
              <p className="text-gray-600 text-sm">AI Accuracy</p>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Pending Verification</h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 hidden md:inline">AI Pre-screened</span>
              </div>
            </div>

            <div className="grid gap-6">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-all">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{request.patient}</h3>
                          <p className="text-gray-600">{request.age} years • {request.condition}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-600 mb-1">Amount</p>
                          <p className="text-2xl font-bold text-gray-900">{request.amount} SOL</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-600 mb-1">Submitted</p>
                          <p className="text-lg font-semibold text-gray-900">{request.submittedDate}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-bold text-gray-700 mb-2">Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          {request.documents.map((doc, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                              📄 {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-64">
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-4 border-2 border-purple-200">
                        <p className="text-sm text-purple-600 font-bold mb-2 text-center">AI Score</p>
                        <div className={`inline-block w-full text-center px-4 py-2 rounded-xl font-bold text-3xl border-2 ${getAiScoreColor(request.aiScore)}`}>
                          {request.aiScore}%
                        </div>
                        <div className="mt-3 flex justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xl ${i < Math.floor(request.aiScore / 20) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Eye size={20} />
                          Review
                        </button>
                        <button
                          onClick={() => verifyCase(request.id)}
                          disabled={loading}
                          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={20} />
                              Verify & Approve
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Cases */}
          {verifiedCases.length > 0 && (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Activity size={32} className="text-green-600" />
                Verified Cases
              </h2>
              <div className="space-y-4">
                {verifiedCases.map((case_) => (
                  <div key={case_.id} className="border-2 border-green-100 rounded-2xl p-6 bg-green-50/50">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-xl text-gray-900">{case_.patient}</h3>
                          <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                            ✓ Verified
                          </span>
                        </div>
                        <p className="text-gray-600">{case_.condition}</p>
                        <p className="text-sm text-gray-500 mt-1">Verified: {case_.verifiedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Amount</p>
                        <p className="text-2xl font-bold text-green-600">{case_.amount} SOL</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detail Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedRequest(null)}>
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedRequest.patient}</h3>
                <p className="text-gray-600 text-lg mb-6">{selectedRequest.condition}</p>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
                  <p className="text-sm text-purple-600 font-bold mb-4 text-center">AI Verification Analysis</p>
                  <div className={`inline-block w-full text-center px-6 py-3 rounded-xl font-bold text-4xl border-2 ${getAiScoreColor(selectedRequest.aiScore)} mb-4`}>
                    {selectedRequest.aiScore}%
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600 mb-1">Authenticity</p>
                      <p className="font-bold text-green-600">95%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600 mb-1">Consistency</p>
                      <p className="font-bold text-green-600">93%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600 mb-1">Medical Validity</p>
                      <p className="font-bold text-green-600">96%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600 mb-1">Risk Level</p>
                      <p className="font-bold text-green-600">Low</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">Patient Info</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Age:</span> {selectedRequest.age}</p>
                      <p><span className="font-semibold">Condition:</span> {selectedRequest.condition}</p>
                      <p><span className="font-semibold">Amount:</span> {selectedRequest.amount} SOL</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-2">Documents</p>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                          <span className="text-sm font-medium text-blue-700">📄 {doc}</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => verifyCase(selectedRequest.id)}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Verify
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
