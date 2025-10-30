"use client";
import { useState, useEffect } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Loader2, CheckCircle, XCircle, TrendingUp, DollarSign, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import EncryptedDocumentUpload from './EncryptedUpload';
import { requestLoan, postEmergency } from '@/utils/program';

export default function VendorDashboard() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loanAmount, setLoanAmount] = useState(5000);
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [myLoans, setMyLoans] = useState([]);
  const [creditScore, setCreditScore] = useState(0);
  const [emergencyDesc, setEmergencyDesc] = useState("");
  const [emergencyAmount, setEmergencyAmount] = useState(0);

  const handleRequestLoan = async () => {
    if (!wallet.connected) {
      toast.error("Please connect your wallet!");
      return;
    }

    if (!loanPurpose || loanPurpose.length < 10) {
      toast.error("Please provide a detailed purpose (min 10 characters)");
      return;
    }

    const toastId = toast.loading("Requesting loan...");
    setLoading(true);

    try {
      const { signature, loanAccount } = await requestLoan(
        wallet,
        connection,
        loanAmount,
        loanPurpose
      );
      
      toast.success(
        <div>
          <p className="font-bold">Loan Request Successful! 🎉</p>
          <a 
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-xs underline"
          >
            View Transaction
          </a>
        </div>,
        { id: toastId, duration: 5000 }
      );
      
      setMyLoans([...myLoans, {
        id: loanAccount.toString(),
        amount: loanAmount,
        repaid: 0,
        purpose: loanPurpose,
        creditScore: 0,
        date: new Date().toLocaleDateString(),
        signature
      }]);
      
      setLoanAmount(5000);
      setLoanPurpose("");
    } catch (error) {
      console.error("Error requesting loan:", error);
      toast.error(`Failed: ${error.message}`, { id: toastId });
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

    const toastId = toast.loading("Posting emergency...");
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
        <div>
          <p className="font-bold">Emergency Posted! 🏥</p>
          <a 
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-xs underline"
          >
            View Transaction
          </a>
        </div>,
        { id: toastId, duration: 5000 }
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
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your loans and emergency funding</p>
        </div>
        <WalletMultiButton />
      </div>

      {!wallet.connected ? (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 text-center border-2 border-dashed border-blue-300 shadow-xl">
          <div className="text-7xl mb-6 animate-pulse">🔐</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
            Connect your Solana wallet to access micro-loans and emergency funding
          </p>
          <WalletMultiButton />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Credit Score Card */}
          <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full -ml-48 -mb-48"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-purple-200 mb-3 text-lg font-medium flex items-center gap-2 justify-center md:justify-start">
                  <TrendingUp size={20} />
                  Your Credit Score
                </p>
                <h2 className="text-7xl md:text-8xl font-bold mb-4">{creditScore}</h2>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-3xl ${i < Math.floor(creditScore / 20) ? 'text-yellow-300' : 'text-white/30'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-lg text-purple-200 font-medium">
                    {creditScore >= 80 ? "Excellent" : creditScore >= 60 ? "Good" : creditScore >= 40 ? "Fair" : "Building"}
                  </span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-purple-200 mb-2 text-sm">Available Credit</p>
                <h3 className="text-4xl font-bold flex items-center gap-2">
                  <DollarSign size={32} />
                  {10000 + (creditScore * 100)}
                </h3>
                <p className="text-sm text-purple-200 mt-2">Based on your score</p>
              </div>
            </div>
          </div>

          {/* Loan & Emergency Grid */}
          <div className="grid lg:grid-cols-2 gap-8 grid-responsive">
            {/* Request Loan Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <DollarSign size={28} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Micro-Loan</h2>
                  <p className="text-gray-600">2,000 - 10,000 Lamports</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Loan Amount (Lamports)
                  </label>
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="500"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-center mt-3">
                    <span className="text-3xl font-bold text-blue-600">{loanAmount}</span>
                    <span className="text-gray-500 ml-2">lamports</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Purpose of Loan
                  </label>
                  <textarea
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    placeholder="e.g., Buy inventory for my vegetable cart..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none resize-none transition-all"
                    rows="4"
                  />
                  <p className="text-xs text-gray-500 mt-2">{loanPurpose.length}/200 characters</p>
                </div>

                <button
                  onClick={handleRequestLoan}
                  disabled={loading || !loanPurpose}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} />
                      Request Loan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Emergency Fund Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <FileText size={28} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Emergency Medical Fund</h2>
                  <p className="text-gray-600">Encrypted & verified</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Amount Needed (SOL)
                  </label>
                  <input
                    type="number"
                    value={emergencyAmount}
                    onChange={(e) => setEmergencyAmount(parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none text-2xl font-bold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    value={emergencyDesc}
                    onChange={(e) => setEmergencyDesc(e.target.value)}
                    placeholder="Describe the medical emergency..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none resize-none transition-all"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Upload Medical Document
                  </label>
                  <EncryptedDocumentUpload onUpload={handleEncryptedUpload} />
                </div>
              </div>
            </div>
          </div>

          {/* My Loans Section */}
          {myLoans.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-slide-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp size={32} className="text-blue-600" />
                My Active Loans
              </h2>
              <div className="space-y-4">
                {myLoans.map((loan) => (
                  <div 
                    key={loan.id} 
                    className="border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-blue-50"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{loan.amount} Lamports</h3>
                        <p className="text-gray-600 text-sm mb-2">{loan.purpose}</p>
                        <p className="text-xs text-gray-400">
                          Requested: {loan.date} • Account: {loan.id.slice(0, 8)}...
                        </p>
                      </div>
                      <a
                        href={`https://explorer.solana.com/tx/${loan.signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
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
