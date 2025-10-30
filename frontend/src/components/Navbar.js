"use client";
import { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 md:px-6 py-4 shadow-xl sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            SolCare
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full hidden md:inline">v1.0</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-blue-200 transition-colors font-medium">
            Home
          </Link>
          <Link href="/vendor" className="hover:text-blue-200 transition-colors font-medium">
            Vendor
          </Link>
          <Link href="/donor" className="hover:text-blue-200 transition-colors font-medium">
            Donor
          </Link>
          <Link href="/hospital" className="hover:text-blue-200 transition-colors font-medium">
            Hospital
          </Link>
          <WalletMultiButton className="!bg-white !text-blue-600 !rounded-xl !px-4 !py-2 !font-bold hover:!bg-blue-50 !transition-all" />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3 animate-slide-in">
          <Link 
            href="/" 
            className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/vendor" 
            className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Vendor
          </Link>
          <Link 
            href="/donor" 
            className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Donor
          </Link>
          <Link 
            href="/hospital" 
            className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Hospital
          </Link>
          <div className="pt-2">
            <WalletMultiButton className="!w-full !bg-white !text-blue-600 !rounded-xl !py-3 !font-bold" />
          </div>
        </div>
      )}
    </nav>
  );
}
