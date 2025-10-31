"use client";
import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Activity, CheckCircle, Clock, Shield, TrendingUp, Eye, Loader2, Sparkles } from 'lucide-react';
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

    const toastId = toast.loading("🏥 Verifying case...");
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const verified = pendingRequests.find(r => r.id === requestId);
      setVerifiedCases([...verifiedCases, { ...verified, verifiedDate: new Date().toLocaleDateString() }]);

      toast.success(
        <div>
          <p className="font-bold flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400" />
            Case Verified Successfully! ✅
          </p>
          <p className="text-sm text-gray-300">Case ID: {requestId}</p>
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
    if (score >= 90) return 'text-green-400 bg-green-500/20 border-green-500/50';
    if (score >= 75) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
    return 'text-red-400 bg-red-500/20 border-red-500/50';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-slide-in">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Hospital Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Verify emergency cases & manage withdrawals</p>
        </div>
        <WalletMultiButton />
      </div>

      {!wallet.connected ? (
        <div className="glass rounded-3xl p-12 text-center border-2 border-red-500/30 shadow-2xl animate-scale-in">
          <div className="text-7xl mb-6 animate-float">🏥</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hospital Verification Portal</h2>
          <p className="text-gray-300 mb-8 text-lg max-w-md mx-auto">
            Connect your authorized hospital wallet to verify emergency cases
          </p>
          <WalletMultiButton />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { icon: Clock, color: 'red', label: 'Pending', value: pendingRequests.length },
              { icon: CheckCircle, color: 'green', label: 'Verified', value: verifiedCases.length },
              { icon: TrendingUp, color: 'blue', label: 'SOL Available', value: '47.5' },
              { icon: Shield, color: 'purple', label: 'AI Accuracy', value: '96%' }
            ].map((stat, i) => (
              <div key={i} className={`glass-dark rounded-2xl p-4 md:p-6 border border-${stat.color}-500/30 hover:border-${stat.color}-500/50 transition-all card-hover`}>
                <stat.icon size={32} className={`text-${stat.color}-400 mb-3`} />
                <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Pending Requests */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="text-purple-400" />
                Pending Verification
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 hidden md:inline">AI Pre-screened</span>
              </div>
            </div>

            <div className="grid gap-6">
              {pendingRequests.map((request) => (
                <div key={request.id} className="glass-dark rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 p-4 md:p-6 hover:border-purple-500/50 transition-all card-hover">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{request.patient}</h3>
                          <p className="text-gray-400">{request.age} years • {request.condition}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getUrgencyColor(request.urgency)} backdrop-blur-sm`}>
                          {request.urgency}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="glass rounded-xl p-4 border border-white/10">
                          <p className="text-sm text-gray-400 mb-1">Amount</p>
                          <p className="text-2xl font-bold text-white">{request.amount} SOL</p>
                        </div>
                        <div className="glass rounded-xl p-4 border border-white/10">
                          <p className="text-sm text-gray-400 mb-1">Submitted</p>
                          <p className="text-lg font-semibold text-white">{request.submittedDate}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-bold text-gray-300 mb-2">Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          {request.documents.map((doc, i) => (
                            <span key={i} className="px-3 py-1 glass text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30">
                              📄 {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-64">
                      <div className="glass rounded-2xl p-6 mb-4 border-2 border-purple-500/30 animate-glow">
                        <p className="text-sm text-purple-300 font-bold mb-2 text-center">AI Score</p>
                        <div className={`w-full text-center px-4 py-2 rounded-xl font-bold text-3xl border-2 ${getAiScoreColor(request.aiScore)}`}>
                          {request.aiScore}%
                        </div>
                        <div className="mt-3 flex justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xl ${i < Math.floor(request.aiScore / 20) ? 'text-yellow-400' : 'text-gray-600'}`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <Eye size={18} />
                          Review
                        </button>

                        <button
                          onClick={() => verifyCase(request.id)}
                          disabled={loading}
                          className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                          {loading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              Confirm Verification
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
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/40 p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <Activity size={36} className="text-emerald-500 drop-shadow-md" />
                Verified Cases
              </h2>
              <div className="space-y-5">
                {verifiedCases.map((case_) => (
                  <div
                    key={case_.id}
                    className="bg-gradient-to-br from-emerald-50 via-green-50 to-white border border-green-100 rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-2xl text-gray-900 tracking-tight">
                            {case_.patient}
                          </h3>
                          <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold shadow">
                            ✓ Verified
                          </span>
                        </div>
                        <p className="text-gray-600">{case_.condition}</p>
                        <p className="text-sm text-gray-500 mt-1">Verified: {case_.verifiedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Amount</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 text-transparent bg-clip-text">
                          {case_.amount} SOL
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detail Modal */}
          {selectedRequest && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedRequest(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto border border-white/50"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{selectedRequest.patient}</h3>
                <p className="text-gray-700 text-lg mb-6">{selectedRequest.condition}</p>

                <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 rounded-2xl p-6 mb-6 border-2 border-purple-200 shadow-inner">
                  <p className="text-sm font-semibold text-purple-700 mb-4 text-center tracking-wide">
                    AI Verification Analysis
                  </p>
                  <div
                    className={`inline-block w-full text-center px-6 py-4 rounded-xl font-extrabold text-4xl border-2 ${getAiScoreColor(
                      selectedRequest.aiScore
                    )} mb-4 transition-all`}
                  >
                    {selectedRequest.aiScore}%
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      ["Authenticity", "95%"],
                      ["Consistency", "93%"],
                      ["Medical Validity", "96%"],
                      ["Risk Level", "Low"],
                    ].map(([label, value], i) => (
                      <div key={i} className="bg-white/80 rounded-lg p-4 shadow-sm">
                        <p className="text-gray-600 mb-1">{label}</p>
                        <p className="font-bold text-green-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-5 mb-6">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <p className="text-sm font-bold text-gray-700 mb-2">Patient Info</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Age:</span> {selectedRequest.age}</p>
                      <p><span className="font-semibold">Condition:</span> {selectedRequest.condition}</p>
                      <p><span className="font-semibold">Amount:</span> {selectedRequest.amount} SOL</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-3">Documents</p>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100 hover:shadow-sm transition-all"
                        >
                          <span className="text-sm font-medium text-blue-700 flex items-center gap-2">
                            📄 {doc}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-all">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 bg-gray-200/80 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => verifyCase(selectedRequest.id)}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
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
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
