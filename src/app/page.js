"use client";

import { useState, useEffect } from "react";
import { wrapFetchWithPayment } from "x402-fetch";
import { useWalletClient } from "wagmi";

import Header from "@/components/header";
import Input from "@/components/input";
import SubmitButton from "@/components/submit-button";
import Showcase from "@/components/showcase";
import ErrorToast from "@/components/error";
import ResultModal from "@/components/result";

import Image from "next/image";
import glow from "../../public/glow.png";

export default function HomePage() {
  const { data: walletClient } = useWalletClient();

  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically show modal when result is set
  useEffect(() => {
    if (result) {
      setShowModal(true);
    }
  }, [result]);

  const handleSubmit = async (e) => {
    if (!walletClient) {
      setError("Please connect your wallet first.");
      return;
    }

    const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient);

    setLoading(true);
    setError(null);
    setResult(null);
    setShowModal(false);

    try {
      const res = await fetchWithPayment("/api/protected", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(input);
        setResult(data.result); // This triggers modal via useEffect
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
      <div className="p-4 mt-33 mb-10 mx-auto rounded-4xl bg-[#FBFAFA]">
        <div className="relative flex justify-center items-center mt-24 mb-4">
          {/* Glow background */}
          <Image
            src={glow}
            alt="glow"
            width={600}
            height={600}
            className="opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          />

          {/* Title Text */}
          <h1 className="text-[2.5rem] lg:text-[4.2rem] text-center text-[#36322F] font-semibold tracking-tight leading-[0.9] relative z-10">
            The animated icon generator
            <br />
            <span className="block leading-[1.3]">
              <span className="relative px-1 text-orange-600 inline-flex justify-center items-center">
                runs by AI agents on Base
              </span>
            </span>
          </h1>
        </div>

        <p className="text-center text-[#71717a] text-lg mt-8 max-w-2xl mx-82">
          Let a team of AI agents to plan, draw, script, and animate any icon
          you want. X402 protocol-powered, pay-per-use.
        </p>

        <div className="w-full flex flex-col items-center gap-4 mt-12">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            loading={loading}
          />

          <SubmitButton loading={loading} onSubmit={handleSubmit} />
        </div>

        <Showcase />

        {error && <ErrorToast message={error} />}
      </div>

      {showModal && result && (
        <ResultModal url={result} onClose={() => setShowModal(false)} />
      )}
    </main>
  );
}
