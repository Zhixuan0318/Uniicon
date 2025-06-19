"use client";

import { useEffect, useRef, useState } from "react";
import { triggerFireworks } from "@/lib/triggerFirework";
import Image from "next/image";
import closeIcon from "../../public/close.png";
import { useAccount } from "wagmi";

export default function ResultModal({ url, onClose }) {
  const overlayRef = useRef();
  const hasCalledAPI = useRef(false);
  const { address } = useAccount();

  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    triggerFireworks(2000);
  }, []);

  useEffect(() => {
    if (url && address && !hasCalledAPI.current) {
      hasCalledAPI.current = true;

      const mint = async () => {
        try {
          setMinting(true);
          const res = await fetch("/api/pinata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, address }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Minting failed");

          setTxHash(data.txHash);
        } catch (err) {
          setError(err.message);
        } finally {
          setMinting(false);
        }
      };

      mint();
    }
  }, [url, address]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "animated-icon.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-orange-50 bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-4xl p-6 relative w-full max-w-lg mx-auto shadow-lg">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transform transition-transform duration-200 hover:scale-110"
        >
          <Image src={closeIcon} alt="Close" width={35} height={35} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-center mb-4 mt-15">
          Here&apos;s your 3D animated icon!
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 text-center mb-6 px-6">
          Please download your icon before closing this modal. It has also been
          minted as an NFT and sent to your wallet, so you can access it again
          anytime in the future.
        </p>

        {/* Video */}
        <div className="w-full aspect-square rounded-4xl shadow-sm bg-gray-200 overflow-hidden mb-5">
          <video
            src={url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Minting status */}
        {minting ? (
          <div className="flex items-center gap-3 text-yellow-600 font-medium text-lg justify-center">
            <svg
              className="animate-spin h-6 w-6 text-yellow-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Minting in Progress...
          </div>
        ) : txHash ? (
          <div className="text-green-700 font-semibold text-lg text-center mb-4">
            ✅ It&apos;s in your wallet too.<br />
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View on Explorer
            </a>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center font-medium mb-4">
            ❌ Minting failed: {error}
          </div>
        ) : null}

        {/* Download Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleDownload}
            className="mt-3 rounded-[10px] text-lg font-semibold flex items-center justify-center
              transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50
              bg-orange-500 text-white hover:bg-orange-400 disabled:bg-orange-200
              [box-shadow:0_0_0_1px_hsl(24,100%,91%),_0_1px_2px_hsl(24,90%,60%),_0_3px_3px_hsl(24,95%,70%),_0_-2px_hsl(24,90%,88%)_inset]
              hover:translate-y-[1px] hover:scale-[0.98]
              active:translate-y-[2px] active:scale-[0.97]
              h-15 px-10 mb-2 w-full min-w-72"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
