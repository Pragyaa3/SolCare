import "./globals.css";
import Navbar from "@/components/Navbar";
import WalletProviders from "@/components/WalletProviders";

export const metadata = {
  title: "SolCare",
  description: "From Daily Hustle to Emergency Care — Solana Blockchain for Everyone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <WalletProviders>
          <Navbar />
          <main className="min-h-screen px-6 py-8">{children}</main>
        </WalletProviders>
      </body>
    </html>
  );
}
