"use client";

import { useEffect, useRef, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";
import { config } from "@/config/wagmi";
import Image from "next/image";

import icon from "../../public/spark.png";
import usdc from "../../public/usdc.png";
import wallet from "../../public/wallet.png";
import swap from "../../public/switch.png";
import ProgressLoader from "./progress";
import ErrorToast from "./error";

const TARGET_CHAIN = config.chains[0];
const WHITELIST = ["0xd9ba52fc3366dded194c3c77c9c9955e8fe6059a"];

export default function SubmitButton({ loading, onSubmit }) {
  const { openConnectModal } = useConnectModal();
  const { isConnected, chainId, address } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain({ config });

  const needsSwitch = isConnected && chainId !== TARGET_CHAIN.id;
  const isDisabled = loading || isSwitching;
  const showPricing = isConnected && !needsSwitch && !loading;

  const [percentage, setPercentage] = useState(0);
  const intervalRef = useRef(null);

  const [showError, setShowError] = useState(false);

  // ✅ Check if connected address is whitelisted
  const isWhitelisted =
    address?.toLowerCase && WHITELIST.includes(address.toLowerCase());

  // Simulate progress increase
  useEffect(() => {
    if (loading) {
      setPercentage(0);
      const startTime = Date.now();
      const duration = 2 * 60 * 1000; // 2 minutes

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 99);
        setPercentage(progress);
      }, 200);
    } else {
      // If process finishes
      clearInterval(intervalRef.current);
      setPercentage(100);

      // Optional: auto-reset to 0 after short delay
      setTimeout(() => setPercentage(0), 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [loading]);

  const handleClick = () => {
    if (!isConnected) {
      openConnectModal?.();
    } else if (needsSwitch) {
      switchChain?.({ chainId: TARGET_CHAIN.id });
    } else if (!isWhitelisted) {
      setShowError(false); // Reset first
      setTimeout(() => setShowError(true), 50); // Re-trigger
    } else {
      onSubmit?.();
    }
  };

  let buttonText = "Generate";
  let buttonIcon = icon;

  if (!isConnected) {
    buttonText = "Connect Wallet To Generate";
    buttonIcon = wallet;
  } else if (needsSwitch) {
    buttonText = `Switch to ${TARGET_CHAIN.name}`;
    buttonIcon = swap;
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleClick}
        className="
          mt-5 rounded-[10px] text-lg font-semibold flex items-center justify-center
          transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50
          bg-orange-500 text-white hover:bg-orange-400 disabled:bg-orange-200
          [box-shadow:0_0_0_1px_hsl(24,100%,91%),_0_1px_2px_hsl(24,90%,60%),_0_3px_3px_hsl(24,95%,70%),_0_-2px_hsl(24,90%,88%)_inset]
          hover:translate-y-[1px] hover:scale-[0.98]
          active:translate-y-[2px] active:scale-[0.97]
          h-15 px-10 mb-2 w-auto min-w-72
        "
      >
        <Image
          src={buttonIcon}
          alt="Status icon"
          width={25}
          height={25}
          className="mr-2 -ml-1.5"
        />
        <span className="whitespace-nowrap">
          {isDisabled ? (loading ? "Processing..." : "Loading...") : buttonText}
        </span>
      </button>

      {/* Loader or Pricing Info */}
      {loading ? (
        <div className="pt-4 w-full">
          <ProgressLoader percentage={Math.floor(percentage)} />
        </div>
      ) : showPricing ? (
        <p className="text-sm text-gray-400 flex items-center gap-1 pt-3">
          We have a fixed pricing of 1
          <Image
            src={usdc}
            alt="USDC"
            width={25}
            height={25}
            className="inline-block"
          />
          per generation
        </p>
      ) : (
        <p className="text-sm text-gray-400 pt-3 text-center">
          Unlock the generator with successful wallet connect
        </p>
      )}
      {showError && (
        <ErrorToast message="Your wallet is not whitelisted to generate content. As Uniicon is still in testnet and the generation requires resources, kindly contact @tzx0318 on X to get a free trial!" />
      )}
    </div>
  );
}
