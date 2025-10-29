import "./globals.css";
import Navbar from "@/components/Navbar";
import WalletContextProvider from "@/components/WalletProvider";

export const metadata = {
  title: "SolCare - Blockchain for Everyone",
  description: "Decentralized Medical Aid & Microfinance on Solana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <WalletContextProvider>
          <Navbar />
          <main className="min-h-screen px-6 py-8">{children}</main>
        </WalletContextProvider>
      </body>
    </html>
  );
}