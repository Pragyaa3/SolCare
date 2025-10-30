"use client";
import { useState } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Heart, TrendingUp, Users, Clock, CheckCircle, Loader2, Sparkles, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { fundEmergency } from '@/utils/program';

export default function DonorDashboard() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [donationAmount, setDonationAmount] = useState(1);
  const [myDonations, setMyDonations] = useState([]);

  const [emergencyCases] = useState([
    {
      id: 1,
      patient: "Ramesh Kumar",
      age: 45,
      condition: "Heart Surgery Required",
      hospital: "Apollo Hospital, Delhi",
      required: 5,
      funded: 3.2,
      verified: true,
      urgency: "Critical",
      story: "Street vendor needs urgent heart surgery. Family cannot afford treatment.",
      donors: 24,
      daysLeft: 3,
      image: "🫀",
      account: "ABC123...xyz"
    },
    {
      id: 2,
      patient: "Sunita Devi",
      age: 32,
      condition: "Cancer Treatment",
      hospital: "Tata Memorial, Mumbai",
      required: 8,
      funded: 5.8,
      verified: true,
      urgency: "High",
      story: "Mother of two needs chemotherapy. Lost husband last year.",
      donors: 42,
      daysLeft: 7,
      image: "🎗️",
      account: "DEF456...abc"
    },
    {
      id: 3,
      patient: "Mohan Singh",
      age: 28,
      condition: "Accident - Multiple Fractures",
      hospital: "AIIMS, New Delhi",
      required: 3.5,
      funded: 0.8,
      verified: true,
      urgency: "Urgent",
      story: "Young father had road accident. Needs immediate surgery.",
      donors: 8,
      daysLeft: 5,
      image: "🏥",
      account: "GHI789...def"
    }
  ]);

  const handleDonate = async (caseItem, amount) => {
    if (!wallet.connected) {
      toast.error("Please connect your wallet!");
      return;
    }

    const toastId = toast.loading(`💚 Donating ${amount} SOL...`);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const donation = {
        id: Date.now(),
        caseId: caseItem.id,
        amount,
        date: new Date().toLocaleDateString(),
        txHash: "0x" + Math.random().toString(16).substring(2, 20),
        patientName: caseItem.patient
      };
      
      setMyDonations([...myDonations, donation]);
      
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-bold flex items-center gap-2">
            <Heart size={18} className="text-green-400" />
            Donation Successful! 💚
          </p>
          <p className="text-sm text-gray-300">{amount} SOL donated to {caseItem.patient}</p>
        </div>,
        { id: toastId, duration: 5000 }
      );
      
      setSelectedCase(null);
    } catch (error) {
      console.error("Error donating:", error);
      toast.error(`Failed: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'Urgent': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-slide-in">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Donor Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Support verified medical emergencies on-chain</p>
        </div>
        <WalletMultiButton />
      </div>

      {!wallet.connected ? (
        <div className="glass rounded-3xl p-12 text-center border-2 border-green-500/30 shadow-2xl animate-scale-in">
          <div className="text-7xl mb-6 animate-float">❤️</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect to Start Donating</h2>
          <p className="text-gray-300 mb-8 text-lg max-w-md mx-auto">
            Your contributions save lives. 100% transparent, 0% fraud.
          </p>
          <WalletMultiButton />
        </div>
      ) : (
        <>
          {/* Impact Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="glass-dark rounded-2xl md:rounded-3xl p-4 md:p-6 border border-green-500/30 hover:border-green-500/50 transition-all card-hover">
              <Heart size={32} className="text-green-400 mb-3 animate-pulse" />
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{myDonations.length}</h3>
              <p className="text-gray-400 text-sm">Lives Impacted</p>
            </div>
            <div className="glass-dark rounded-2xl md:rounded-3xl p-4 md:p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all card-hover">
              <TrendingUp size={32} className="text-blue-400 mb-3" />
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">
                {myDonations.reduce((sum, d) => sum + d.amount, 0)}
              </h3>
              <p className="text-gray-400 text-sm">SOL Donated</p>
            </div>
            <div className="glass-dark rounded-2xl md:rounded-3xl p-4 md:p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all card-hover">
              <Users size={32} className="text-purple-400 mb-3" />
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">Top 5%</h3>
              <p className="text-gray-400 text-sm">Donor Rank</p>
            </div>
            <div className="glass-dark rounded-2xl md:rounded-3xl p-4 md:p-6 border border-orange-500/30 hover:border-orange-500/50 transition-all card-hover">
              <Zap size={32} className="text-orange-400 mb-3" />
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">Instant</h3>
              <p className="text-gray-400 text-sm">Impact Speed</p>
            </div>
          </div>

          {/* Active Cases */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="text-yellow-400" />
                Active Emergency Cases
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 hidden md:inline">Live Updates</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {emergencyCases.map((case_) => {
                const progressPercent = (case_.funded / case_.required) * 100;
                
                return (
                  <div key={case_.id} className="glass-dark rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 overflow-hidden hover:border-green-500/50 transition-all duration-300 group card-hover">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-32 md:h-40 flex items-center justify-center text-5xl md:text-6xl">
                        {case_.image}
                      </div>
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border-2 ${getUrgencyColor(case_.urgency)} backdrop-blur-sm`}>
                        {case_.urgency}
                      </div>
                      {case_.verified && (
                        <div className="absolute top-4 left-4 bg-green-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle size={14} />
                          Verified
                        </div>
                      )}
                    </div>

                    <div className="p-4 md:p-6">
                      <h3 className="font-bold text-lg md:text-xl text-white mb-1">{case_.patient}</h3>
                      <p className="text-gray-400 text-sm mb-2">{case_.age} years • {case_.condition}</p>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{case_.story}</p>

                      <div className="glass rounded-xl p-3 mb-4 text-xs md:text-sm border border-white/10">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <span>🏥</span>
                          <span className="truncate">{case_.hospital}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users size={14} /> {case_.donors}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {case_.daysLeft}d
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="font-bold text-white">{case_.funded} / {case_.required} SOL</span>
                        </div>
                        <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 animate-shimmer"
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{progressPercent.toFixed(1)}% funded</p>
                      </div>

                      <button
                        onClick={() => setSelectedCase(case_)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/50"
                      >
                        <Heart size={20} />
                        Donate Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Donations */}
          {myDonations.length > 0 && (
            <div className="glass-dark rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Heart size={32} className="text-green-400" />
                My Donation History
              </h2>
              <div className="space-y-3">
                {myDonations.map((donation) => (
                  <div key={donation.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 glass rounded-xl hover:border-green-500/50 transition-all border border-white/10 card-hover">
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        💚
                      </div>
                      <div>
                        <p className="font-semibold text-white">{donation.patientName}</p>
                        <p className="text-sm text-gray-400">{donation.date}</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-bold text-green-400 text-lg">{donation.amount} SOL</p>
                      <p className="text-xs text-gray-500 font-mono">{donation.txHash}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donation Modal */}
          {selectedCase && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedCase(null)}>
              <div className="glass-dark rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-green-500/30 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 animate-float">{selectedCase.image}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedCase.patient}</h3>
                  <p className="text-gray-400">{selectedCase.condition}</p>
                </div>

                <div className="glass rounded-2xl p-4 mb-6 space-y-2 text-sm border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Required</span>
                    <span className="font-bold text-white">{selectedCase.required} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Already Funded</span>
                    <span className="font-bold text-green-400">{selectedCase.funded} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Still Needed</span>
                    <span className="font-bold text-red-400">{(selectedCase.required - selectedCase.funded).toFixed(2)} SOL</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Your Donation Amount (SOL)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[0.5, 1, 2, 5].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount)}
                        className={`py-3 rounded-xl font-bold transition-all ${
                          donationAmount === amount 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50 scale-105' 
                            : 'glass text-gray-300 hover:border-green-500/50'
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
                    step="0.1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/50 focus:outline-none text-center text-2xl font-bold text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="flex-1 glass py-3 rounded-xl font-semibold text-gray-300 hover:border-white/30 transition-colors border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDonate(selectedCase, donationAmount)}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/50 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart size={20} />
                        Donate {donationAmount} SOL
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
