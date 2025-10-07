"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">SolCare</h1>
      <div className="space-x-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/vendor" className="hover:underline">Vendor</Link>
        <Link href="/donor" className="hover:underline">Donor</Link>
        <Link href="/hospital" className="hover:underline">Hospital</Link>
      </div>
    </nav>
  );
}
