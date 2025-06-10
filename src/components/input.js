'use client';

import { useAccount, useChainId } from 'wagmi';
import { config } from '@/config/wagmi';
import Image from 'next/image';
import lock from '../../public/lock.png';

const TARGET_CHAIN_ID = config.chains[0].id;

export default function Input() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const needsSwitch = isConnected && chainId !== TARGET_CHAIN_ID;
  const disabled = !isConnected || needsSwitch;

  return (
    <div className="relative w-full max-w-3xl">
      <input
        disabled={disabled}
        placeholder="Example: A floating hotair balloon with rainbow stripes"
        className="h-18 w-full resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-[18px] text-md text-[#36322F] px-4 pr-12 border border-[#e3e1de] shadow-[0_0_0_1px_#e3e1de66,0_1px_2px_#5f4a2e14,0_4px_6px_#5f4a2e0a,0_40px_40px_-24px_#684b2514] drop-shadow-[rgba(249,224,184,0.3)_-0.73px_-0.73px_35.65px] disabled:opacity-50"
      />
      {disabled && (
        <Image
          src={lock}
          alt="Locked"
          width={35}
          height={35}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
}
