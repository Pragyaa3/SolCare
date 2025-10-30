"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Sparkles, Shield, Zap, Users, TrendingUp, Heart, Building, DollarSign, Lock, ArrowRight, CheckCircle, Globe } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    vendors: 0,
    emergencies: 0,
    funded: 0
  });

  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        vendors: prev.vendors < 100 ? prev.vendors + 3 : 100,
        emergencies: prev.emergencies < 47 ? prev.emergencies + 1 : 47,
        funded: prev.funded < 3200 ? prev.funded + 80 : 3200
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(featureInterval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-16 h-16" />,
      title: "Lightning Fast",
      desc: "Solana's 400ms blocks = instant loans",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Lock className="w-16 h-16" />,
      title: "Arcium Encrypted",
      desc: "Medical records protected by MXE",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: <Shield className="w-16 h-16" />,
      title: "AI Verified",
      desc: "GPT-4 Vision detects fraud 95%+",
      gradient: "from-blue-400 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-32 text-center">
          <div className="mb-8 inline-block">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm font-semibold backdrop-blur-xl flex items-center gap-2 animate-slide-in">
              <Sparkles size={16} className="text-yellow-400" />
              Powered by Solana + Arcium + AI
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 animate-slide-in">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SolCare
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-in font-light">
            Privacy-Preserving Medical Aid & Microfinance
            <br />
            <span className="text-purple-400 font-semibold">100M+ Street Vendors</span> • 
            <span className="text-blue-400 font-semibold"> Zero Fraud</span> • 
            <span className="text-pink-400 font-semibold"> Instant Impact</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-in">
            <Link 
              href="/vendor" 
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 flex items-center gap-3"
            >
              <Users size={24} />
              Vendor Dashboard
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/donor" 
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 flex items-center gap-3"
            >
              <Heart size={24} />
              Donor Dashboard
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/hospital" 
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 flex items-center gap-3"
            >
              <Building size={24} />
              Hospital Portal
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
                {stats.vendors}+
              </div>
              <div className="text-gray-400 font-medium">Active Vendors</div>
              <div className="text-green-400 text-sm mt-2 flex items-center justify-center gap-1">
                <TrendingUp size={14} />
                +12% today
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-pink-500/50">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
                {stats.emergencies}
              </div>
              <div className="text-gray-400 font-medium">Emergencies Funded</div>
              <div className="text-blue-400 text-sm mt-2 flex items-center justify-center gap-1">
                <CheckCircle size={14} />
                Live
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-green-500/50">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2">
                {stats.funded}
              </div>
              <div className="text-gray-400 font-medium">SOL Funded</div>
              <div className="text-purple-400 text-sm mt-2 flex items-center justify-center gap-1">
                <DollarSign size={14} />
                Total Impact
              </div>
            </div>
          </div>
        </div>

        {/* Rotating Feature Showcase */}
        <div className="mb-32">
          <div className="relative h-96 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ${
                  activeFeature === index 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95'
                }`}
              >
                <div className={`bg-gradient-to-br ${feature.gradient} p-1 rounded-3xl shadow-2xl`}>
                  <div className="bg-slate-900 rounded-3xl p-12 h-full flex flex-col items-center justify-center text-center">
                    <div className="text-white mb-6 transform hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-4xl font-black mb-4 text-white">{feature.title}</h3>
                    <p className="text-xl text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Feature Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  activeFeature === index 
                    ? 'w-12 bg-purple-500' 
                    : 'w-3 bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-32">
          <h2 className="text-5xl font-black text-center mb-16 text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            How SolCare Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "📝", title: "Request", desc: "Vendors request loans or post emergencies" },
              { icon: "🤖", title: "AI Verify", desc: "GPT-4 Vision validates authenticity" },
              { icon: "🔐", title: "Arcium Encrypt", desc: "Medical data encrypted with MXE" },
              { icon: "💸", title: "Instant Fund", desc: "SOL transfers in <2 seconds" }
            ].map((step, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-6xl mb-4">{step.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-32 text-center">
          <h2 className="text-5xl font-black mb-16 text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
            Powered By Cutting-Edge Tech
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "Solana", icon: "⚡", color: "from-purple-500 to-pink-500" },
              { name: "Arcium", icon: "🔐", color: "from-blue-500 to-cyan-500" },
              { name: "GPT-4", icon: "🤖", color: "from-green-500 to-emerald-500" },
              { name: "Next.js", icon: "▲", color: "from-gray-700 to-gray-900" },
              { name: "Anchor", icon: "⚓", color: "from-orange-500 to-red-500" }
            ].map((tech, i) => (
              <div key={i} className="group">
                <div className={`bg-gradient-to-br ${tech.color} p-1 rounded-2xl hover:scale-110 transition-all duration-300`}>
                  <div className="bg-slate-900 rounded-2xl p-6">
                    <div className="text-5xl mb-3">{tech.icon}</div>
                    <div className="font-bold text-white">{tech.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-xl border border-purple-500/50 rounded-3xl p-12 text-center">
            <h2 className="text-5xl font-black mb-6 text-white">Ready to Make an Impact?</h2>
            <p className="text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Join the revolution in decentralized healthcare and microfinance
            </p>
            <Link 
              href="/vendor" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-900 rounded-2xl font-black text-xl hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <Sparkles size={24} />
              Get Started Now
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}