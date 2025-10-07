"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-6 text-blue-700">Welcome to SolCare</h1>
      <p className="text-lg mb-8">
        Empowering street vendors and families with micro-loans and emergency medical funds on Solana Blockchain.
      </p>

      <div className="flex justify-center space-x-6">
        <Link href="/vendor" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Vendor Dashboard
        </Link>
        <Link href="/donor" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
          Donor Dashboard
        </Link>
        <Link href="/hospital" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
          Hospital Dashboard
        </Link>
      </div>

      <section className="mt-16 text-left">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Vendors request micro-loans to buy stock and build credit scores.</li>
          <li>Donors fund emergencies directly on-chain using Solana.</li>
          <li>Hospitals receive payments securely; leftover funds return to donors.</li>
          <li>High credit score vendors gain priority access to emergency funds.</li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Why SolCare?</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Fast micro-loans and donations via Solana.</li>
          <li>Transparent, fraud-resistant funding.</li>
          <li>Empowers 100M+ street vendors in India.</li>
          <li>Self-sustaining, story-driven social impact platform.</li>
        </ul>
      </section>
    </div>
  );
}
