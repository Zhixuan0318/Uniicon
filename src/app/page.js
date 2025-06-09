"use client";

import { useState } from "react";
import { wrapFetchWithPayment } from "x402-fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import Header from "@/components/header";
import Input from "@/components/input";

const PRIVATE_KEY = process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY;

const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient);

export default function HomePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetchWithPayment("/api/protected", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      } else {
        const err = await res.json();
        setError(err.error || "Unknown error");
      }
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <div className="p-4 mt-10 mx-auto rounded-4xl h- bg-[#FBFAFA]">
        <h1 className="text-[2.5rem] lg:text-[4.2rem] text-center text-[#36322F] font-semibold tracking-tight leading-[0.9] mt-24">
          The animated icon generator
          <br />
          <span className="block leading-[1.3]">
            <span className="relative px-1 text-orange-600 inline-flex justify-center items-center">
              runs by AI agents on Base
            </span>
          </span>
        </h1>

        <p className="text-center text-[#71717a] text-lg mt-8 max-w-2xl mx-82">
          Let a team of AI agents to plan, draw, script, and animate any icon you want. X402 protocol-powered, pay-per-use.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-4 mt-12"
        >
          <Input />
          <button
            type="submit"
            disabled={loading}
            className="mb-20 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-lg px-4 py-2 rounded-2xl transition disabled:opacity-50 w-60 h-14 mt-5"
          >
            {loading ? "Processing..." : "Generate"}
          </button>
        </form>

        {result && (
          <div className="p-4 bg-green-100 border-green-400">{result}</div>
        )}
        {error && <div className="p-4 bg-red-100 border-red-400">{error}</div>}
      </div>
    </main>
  );
}
