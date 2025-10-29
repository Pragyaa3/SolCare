"use client";
import Link from "next/link";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">SolCare</h1>
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/vendor" className="hover:underline">Vendor</Link>
        <Link href="/donor" className="hover:underline">Donor</Link>
        <Link href="/hospital" className="hover:underline">Hospital</Link>
        <WalletMultiButton className="!bg-white !text-blue-600 !rounded-lg !px-4 !py-2 hover:!bg-gray-100" />
      </div>
    </nav>
  );
}
