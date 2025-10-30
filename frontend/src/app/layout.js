import "./globals.css";
import Navbar from "@/components/Navbar";
import WalletContextProvider from "@/components/WalletProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>SolCare - Privacy-Preserving Medical Aid on Solana</title>
        <meta name="description" content="Decentralized Medical Aid & Microfinance powered by Solana, Arcium, and AI" />
      </head>
      <body className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <WalletContextProvider>
          <Navbar />
          <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          
          {/* Animated Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}