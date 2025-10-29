"use client";
import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function DonorDashboard() {
  const wallet = useWallet();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Donor Dashboard</h1>
          <p className="text-gray-600">Support verified medical emergencies</p>
        </div>
        <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !rounded-xl !px-6 !py-3" />
      </div>

      {!wallet.connected ? (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 text-center border-2 border-dashed border-green-300">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect to Start Donating</h2>
          <p className="text-gray-600 mb-6 text-lg">Your contributions save lives</p>
          <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !rounded-xl !px-8 !py-4 !text-lg" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Active Emergency Cases</h2>
          <p className="text-gray-600">Fetch and display emergencies from blockchain here</p>
        </div>
      )}
    </div>
  );
}
