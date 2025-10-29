"use client";
import { useState } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
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
      alert("Please connect your wallet!");
      return;
    }

    if (!loanPurpose || loanPurpose.length < 10) {
      alert("Please provide a detailed purpose (min 10 characters)");
      return;
    }

    setLoading(true);
    try {
      const { signature, loanAccount } = await requestLoan(
        wallet,
        connection,
        loanAmount,
        loanPurpose
      );
      
      alert(`✅ Loan request submitted!\nSignature: ${signature}\nLoan Account: ${loanAccount.toString()}`);
      
      setMyLoans([...myLoans, {
        id: loanAccount.toString(),
        amount: loanAmount,
        repaid: 0,
        purpose: loanPurpose,
        creditScore: 0,
        date: new Date().toLocaleDateString()
      }]);
      
      setLoanAmount(5000);
      setLoanPurpose("");
    } catch (error) {
      console.error("Error requesting loan:", error);
      alert(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEncryptedUpload = async (encryptedData) => {
    if (!wallet.connected) {
      alert("Please connect your wallet!");
      return;
    }

    setLoading(true);
    try {
      const { signature, emergencyAccount } = await postEmergency(
        wallet,
        connection,
        emergencyAmount * 1e9, // Convert to lamports
        emergencyDesc,
        encryptedData.hash
      );
      
      alert(`✅ Emergency posted!\nSignature: ${signature}\nEmergency Account: ${emergencyAccount.toString()}`);
      
      setEmergencyDesc("");
      setEmergencyAmount(0);
    } catch (error) {
      console.error("Error posting emergency:", error);
      alert(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your loans and emergency funding</p>
        </div>
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !px-6 !py-3" />
      </div>

      {!wallet.connected ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 text-center border-2 border-dashed border-blue-300">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6 text-lg">Connect your Solana wallet to access micro-loans</p>
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !px-8 !py-4 !text-lg" />
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 mb-2">Your Credit Score</p>
                <h2 className="text-6xl font-bold">{creditScore}</h2>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < Math.floor(creditScore / 20) ? 'text-yellow-300' : 'text-white/30'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Micro-Loan</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loan Amount (Lamports)
                  </label>
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="500"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-xl font-bold text-purple-600 mt-2">
                    {loanAmount}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purpose of Loan
                  </label>
                  <textarea
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    placeholder="e.g., Buy inventory for my vegetable cart..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                    rows="4"
                  />
                </div>

                <button
                  onClick={handleRequestLoan}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-400"
                >
                  {loading ? "Processing..." : "Request Loan"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Medical Fund</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount Needed (SOL)
                  </label>
                  <input
                    type="number"
                    value={emergencyAmount}
                    onChange={(e) => setEmergencyAmount(parseFloat(e.target.value))}
                    placeholder="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={emergencyDesc}
                    onChange={(e) => setEmergencyDesc(e.target.value)}
                    placeholder="Describe the medical emergency..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Medical Document
                  </label>
                  <EncryptedDocumentUpload onUpload={handleEncryptedUpload} />
                </div>
              </div>
            </div>
          </div>

          {myLoans.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Active Loans</h2>
              <div className="space-y-4">
                {myLoans.map((loan) => (
                  <div key={loan.id} className="border-2 border-gray-100 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{loan.amount} Lamports</h3>
                        <p className="text-gray-600 text-sm">{loan.purpose}</p>
                        <p className="text-xs text-gray-400 mt-1">{loan.date}</p>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{loan.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
