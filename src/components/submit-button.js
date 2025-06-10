"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";
import { config } from "@/config/wagmi";
import Image from "next/image";

import icon from "../../public/spark.png";
import usdc from "../../public/usdc.png";
import wallet from "../../public/wallet.png";
import swap from "../../public/switch.png";

const TARGET_CHAIN = config.chains[0];

export default function SubmitButton({ loading, onSubmit }) {
  const { openConnectModal } = useConnectModal();
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain({ config });

  const needsSwitch = isConnected && chainId !== TARGET_CHAIN.id;

  const handleClick = () => {
    if (!isConnected) {
      openConnectModal?.();
    } else if (needsSwitch) {
      switchChain?.({ chainId: TARGET_CHAIN.id });
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

  const isDisabled = loading || isSwitching;
  const showPricing = isConnected && !needsSwitch;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleClick}
        className="
          mt-5 rounded-[10px] text-lg font-semibold flex items-center justify-center
          transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50
          bg-orange-500 text-white hover:bg-orange-400 disabled:bg-orange-200 disabled:text-white
          [box-shadow:0_0_0_1px_hsl(24,100%,91%),_0_1px_2px_hsl(24,90%,60%),_0_3px_3px_hsl(24,95%,70%),_0_-2px_hsl(24,90%,88%)_inset]
          hover:translate-y-[1px] hover:scale-[0.98] hover:[box-shadow:0_0_0_1px_hsl(24,100%,91%),_0_1px_2px_hsl(24,90%,60%)]
          active:translate-y-[2px] active:scale-[0.97] active:[box-shadow:0_0_0_1px_hsl(24,100%,91%),_inset_0_1px_1px_hsl(24,90%,60%)]
          disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100
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

      {showPricing ? (
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
    </div>
  );
}
