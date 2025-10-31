"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Shield, Zap, Users, Heart, Building, ArrowRight, Lock, Eye, Cpu } from 'lucide-react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats] = useState({
    vendors: 100,
    emergencies: 47,
    funded: 3200
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Moving gradient that follows mouse */}
      <div 
        className="fixed w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] pointer-events-none transition-all duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Hero */}
        <div className="pt-32 pb-20">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
              <span className="text-sm text-gray-300">Solana • Arcium • zkProofs • AI</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tight">
            Sol<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Care</span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-400 mb-6 max-w-3xl font-light">
            Privacy-first emergency aid.
            <br/>
            <span className="text-white">From ₹7K to ₹5L.</span> Instant. Verified. Dignified.
          </p>

          <div className="flex flex-wrap gap-4 mb-20">
            <Link href="/vendor" className="group relative px-8 py-4 bg-white text-black rounded-lg font-bold overflow-hidden transition-all hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                <Users size={20}/>
                Vendor
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </span>
            </Link>
            
            <Link href="/donor" className="px-8 py-4 border border-white/20 hover:border-white/40 rounded-lg font-bold hover:bg-white/5 transition-all flex items-center gap-2">
              <Heart size={20}/>
              Donor
            </Link>
            
            <Link href="/hospital" className="px-8 py-4 border border-white/20 hover:border-white/40 rounded-lg font-bold hover:bg-white/5 transition-all flex items-center gap-2">
              <Building size={20}/>
              Hospital
            </Link>
          </div>

          {/* Stats - horizontal cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm">
              <div className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stats.vendors}+
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Active Vendors</div>
            </div>
            
            <div className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm">
              <div className="text-5xl font-black mb-2 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {stats.emergencies}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Emergencies Funded</div>
            </div>
            
            <div className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm">
              <div className="text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {stats.funded}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">SOL Funded</div>
            </div>
          </div>
        </div>

        {/* Features - Different layout */}
        <div className="py-20 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="text-purple-400"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Solana Speed</h3>
                  <p className="text-gray-400">400ms blocks. $0.00025 fees. When lives are at stake, milliseconds matter.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="text-pink-400"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Arcium Encryption</h3>
                  <p className="text-gray-400">Medical records processed in encrypted MXE environment. Privacy absolute.</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="text-cyan-400"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">zkProof Privacy</h3>
                  <p className="text-gray-400">Prove legitimacy without exposing diagnosis. Trust through cryptography.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Cpu className="text-green-400"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Verification</h3>
                  <p className="text-gray-400">GPT-4 Vision trained on Indian hospital docs. 95% fraud detection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works - timeline style */}
        <div className="py-20 border-t border-white/10">
          <h2 className="text-4xl md:text-5xl font-black mb-16">How It Works</h2>
          
          <div className="space-y-8">
            {[
              { num: "01", title: "Upload", desc: "Medical bills or loan requests submitted to platform" },
              { num: "02", title: "Encrypt", desc: "Arcium MXE encrypts all sensitive data before processing" },
              { num: "03", title: "Verify", desc: "AI validates inside encryption, zkProof confirms publicly" },
              { num: "04", title: "Fund", desc: "Solana executes payment in under 2 seconds" }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors">
                  {step.num}
                </div>
                <div className="pt-4">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack - minimal badges */}
        <div className="py-20 border-t border-white/10">
          <h2 className="text-4xl md:text-5xl font-black mb-12">Tech Stack</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { name: "Solana", icon: "⚡" },
              { name: "Arcium MXE", icon: "🔐" },
              { name: "zkProofs", icon: "👁️" },
              { name: "GPT-4 Vision", icon: "🤖" },
              { name: "Anchor", icon: "⚓" },
              { name: "Next.js", icon: "▲" }
            ].map((tech, i) => (
              <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
                <span className="text-2xl">{tech.icon}</span>
                <span className="font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA - bold and simple */}
        <div className="py-20 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              From hype to hope.
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Infrastructure for dignified crisis relief. Built different.
            </p>
            <Link href="/vendor" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-lg font-bold text-lg hover:scale-105 transition-all">
              Get Started
              <ArrowRight size={20}/>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="py-12 border-t border-white/10 text-center text-gray-600 text-sm">
          SolCare • Blockchain for Everyone
        </div>
      </div>
    </div>
  );
}