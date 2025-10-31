"use client";
import { useState } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Loader2, CheckCircle, TrendingUp, DollarSign, FileText, Sparkles, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import EncryptedDocumentUpload from './EncryptedUpload';
import { requestLoan, postEmergency } from '@/utils/program';

export default function VendorDashboard() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loanAmount, setLoanAmount] = useState(0.5);
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [myLoans, setMyLoans] = useState([]);
  const [creditScore, setCreditScore] = useState(0);
  const [emergencyDesc, setEmergencyDesc] = useState("");
  const [emergencyAmount, setEmergencyAmount] = useState(0);

  const handleRequestLoan = async () => {
  if (!wallet.connected) {
    toast.error("Please connect your wallet!", {
      style: { background: '#1e293b', color: '#fff', border: '1px solid #667eea' }
    });
    return;
  }

  if (!loanPurpose || loanPurpose.length < 10) {
    toast.error("Please provide a detailed purpose (min 10 characters)", {
      style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
    });
    return;
  }

  const toastId = toast.loading("🚀 Submitting to Solana blockchain...", {
    style: { background: '#1e293b', color: '#fff', border: '1px solid #667eea' }
  });
  setLoading(true);

  try {
    // Convert SOL to lamports for the contract
    const amountInLamports = loanAmount * 1e9; // 1 SOL = 1 billion lamports

    const { signature, loanAccount } = await requestLoan(
      wallet,
      connection,
      amountInLamports, // Send lamports to contract
      loanPurpose
    );
    
    toast.success(
      <div className="flex flex-col gap-1">
        <p className="font-bold flex items-center gap-2">
          <CheckCircle size={18} className="text-green-400" />
          Loan Request Successful! 🎉
        </p>
        <a 
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-xs underline hover:text-blue-300"
        >
          View on Solana Explorer →
        </a>
      </div>,
      { id: toastId, duration: 6000, style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' } }
    );
    
    setMyLoans([...myLoans, {
      id: loanAccount.toString(),
      amount: loanAmount, // Store in SOL for display
      repaid: 0,
      purpose: loanPurpose,
      creditScore: 0,
      date: new Date().toLocaleDateString(),
      signature
    }]);
    
    setLoanAmount(0.5); // Reset to 0.5 SOL (not 5000)
    setLoanPurpose("");
  } catch (error) {
    console.error("Error requesting loan:", error);
    toast.error(`Failed: ${error.message}`, { 
      id: toastId,
      style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
    });
  } finally {
    setLoading(false);
  }
};

  const handleEncryptedUpload = async (encryptedData) => {
    if (!wallet.connected) {
      toast.error("Please connect your wallet!");
      return;
    }

    if (!emergencyDesc || !emergencyAmount) {
      toast.error("Please fill all fields");
      return;
    }

    const toastId = toast.loading("📡 Posting to blockchain...", {
      style: { background: '#1e293b', color: '#fff', border: '1px solid #667eea' }
    });
    setLoading(true);

    try {
      const { signature, emergencyAccount } = await postEmergency(
        wallet,
        connection,
        emergencyAmount * 1e9,
        emergencyDesc,
        encryptedData.hash
      );

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-bold flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400" />
            Emergency Posted Successfully! 🏥
          </p>
          <p className="text-xs text-gray-300">AI Score: {encryptedData.score}%</p>
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs underline hover:text-blue-300"
          >
            View Transaction →
          </a>
        </div>,
        { id: toastId, duration: 6000, style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' } }
      );

      setEmergencyDesc("");
      setEmergencyAmount(0);
    } catch (error) {
      console.error("Error posting emergency:", error);
      toast.error(`Failed: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-slide-in">
      <Toaster position="top-right" toastOptions={{
        className: 'toast-notification'
      }} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Vendor Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Manage loans & emergency funding on-chain</p>
        </div>
        <WalletMultiButton />
      </div>

      {!wallet.connected ? (
        <div className="glass rounded-3xl p-12 text-center border-2 border-purple-500/30 shadow-2xl animate-scale-in">
          <div className="text-7xl mb-6 animate-float">🔐</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-8 text-lg max-w-md mx-auto">
            Connect your Solana wallet to access micro-loans and emergency funding
          </p>
          <WalletMultiButton />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Credit Score Card */}
          <div className="relative glass-dark rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-purple-500/30 overflow-hidden card-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
            <div className="absolute top-4 right-4">
              <Sparkles className="text-yellow-400 animate-pulse" size={32} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-purple-300 mb-3 text-lg font-medium flex items-center gap-2 justify-center md:justify-start">
                  <TrendingUp size={20} />
                  Your Credit Score
                </p>
                <h2 className="text-7xl md:text-8xl font-black mb-4 text-white">{creditScore}</h2>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-3xl ${i < Math.floor(creditScore / 20) ? 'text-yellow-400' : 'text-gray-600'} transition-all`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-lg text-purple-300 font-medium">
                    {creditScore >= 80 ? "Excellent" : creditScore >= 60 ? "Good" : creditScore >= 40 ? "Fair" : "Building"}
                  </span>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-purple-500/30">
                <p className="text-purple-300 mb-2 text-sm">Available Credit</p>
                <h3 className="text-4xl font-bold text-white flex items-center gap-2">
                  <DollarSign size={32} />
                  {10000 + (creditScore * 100)}
                </h3>
                <p className="text-sm text-purple-300 mt-2">Based on your score</p>
              </div>
            </div>
          </div>

          {/* Loan & Emergency Grid */}
          <div className="grid lg:grid-cols-2 gap-8 grid-responsive">
            {/* Request Loan Card */}
            <div className="glass-dark rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-purple-500/50 transition-all card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-glow">
                  <DollarSign size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Request Micro-Loan</h2>
                  <p className="text-gray-400">0.1 - 5 SOL</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Loan Amount (SOL)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value))} 
                    className="w-full h-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="text-center mt-3">
                    <span className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                      {loanAmount.toFixed(1)} {/* Show 1 decimal place */}
                    </span>
                    <span className="text-gray-400 ml-2">SOL</span>
                    <p className="text-xs text-gray-500 mt-2">
                      ≈ ₹{(loanAmount * 10000).toLocaleString()} {/* Rough conversion for context */}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Purpose of Loan
                  </label>
                  <textarea
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    placeholder="e.g., Buy inventory for my vegetable cart..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none resize-none transition-all text-white placeholder-gray-500"
                    rows="4"
                  />
                  <p className="text-xs text-gray-500 mt-2">{loanPurpose.length}/200 characters</p>
                </div>

                <button
                  onClick={handleRequestLoan}
                  disabled={loading || !loanPurpose}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={24} />
                      Request Loan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Emergency Fund Card */}
            <div className="glass-dark rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-red-500/50 transition-all card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center animate-glow">
                  <FileText size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Emergency Medical Fund</h2>
                  <p className="text-gray-400">AI-verified & encrypted</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Amount Needed (SOL)
                  </label>
                  <input
                    type="number"
                    value={emergencyAmount}
                    onChange={(e) => setEmergencyAmount(parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:outline-none text-3xl font-bold transition-all text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Description
                  </label>
                  <textarea
                    value={emergencyDesc}
                    onChange={(e) => setEmergencyDesc(e.target.value)}
                    placeholder="Describe the medical emergency..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:outline-none resize-none transition-all text-white placeholder-gray-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Upload Medical Document
                  </label>
                  <EncryptedDocumentUpload onUpload={handleEncryptedUpload} />
                </div>
              </div>
            </div>
          </div>

          {/* My Loans */}
          {myLoans.length > 0 && (
            <div className="glass-dark rounded-3xl p-8 shadow-2xl border border-white/10 animate-slide-in">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp size={32} className="text-purple-400" />
                My Active Loans
              </h2>
              <div className="space-y-4">
                {myLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="glass rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 border border-white/10 card-hover"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-white mb-1">{loan.amount} Sol </h3>
                        <p className="text-gray-400 text-sm mb-2">{loan.purpose}</p>
                        <p className="text-xs text-gray-500">
                          {loan.date} • {loan.id.slice(0, 8)}...
                        </p>
                      </div>
                      <a
                        href={`https://explorer.solana.com/tx/${loan.signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all text-sm font-medium flex items-center gap-2"
                      >
                        View on Explorer →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}