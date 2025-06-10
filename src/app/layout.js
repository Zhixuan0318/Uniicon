import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import WalletProvider from "@/context/WalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "x402-Powered Animated Icons Generator",
  description: "The first animated icons generator on Base powered by x402.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-[#36322f]`}
      >
        <div className="flex justify-center w-full">
          <div className="w-full max-w-[100vw] px-[15vw]">
            <WalletProvider>{children}</WalletProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

