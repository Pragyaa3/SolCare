"use client";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Navbar() {
  const { connected, publicKey, connect, disconnect, select, wallets, wallet } = useWallet();
  const onClickWallet = async () => {
    if (connected) return disconnect();
    try {
      if (!wallet) {
        const preferred = wallets?.[0]?.adapter?.name || "Phantom";
        select(preferred);
      }
      await connect();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">SolCare</h1>
      <div className="flex items-center gap-6">
        <div className="space-x-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/vendor" className="hover:underline">Vendor</Link>
          <Link href="/donor" className="hover:underline">Donor</Link>
          <Link href="/hospital" className="hover:underline">Hospital</Link>
          <Link href="/appointments" className="hover:underline">Appointments</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
        </div>
        <button
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded"
          onClick={onClickWallet}
        >
          {connected ? `${publicKey?.toBase58().slice(0, 4)}…${publicKey?.toBase58().slice(-4)}` : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}
