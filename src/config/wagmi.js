import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from '@wagmi/core/chains';

export const config = getDefaultConfig({
  appName: 'icon-x402',
  projectId: '0d96c994eeaf761d2d2ac3a07192d980',
  chains: [baseSepolia],
  ssr: true,
});