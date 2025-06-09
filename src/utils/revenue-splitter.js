import { http, createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import "dotenv/config";

// Set up the public client
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Load sender wallet from environment variables (ensure sender is a connected wallet object)
const sender = process.env.AGENT_WALLET;

// Define owner addresses
const owners = {
  owner1: "0xB1061f26eDcAD70d33ea4681d96e18F9B5316791",
  owner2: "0xB1061f26eDcAD70d33ea4681d96e18F9B5316791",
  owner3: "0xB1061f26eDcAD70d33ea4681d96e18F9B5316791",
};

// Define pool amount as 1 USDC (USDC has 6 decimals, so 1 USDC = 1_000_000)
const poolAmount = 1_000_000n;

// Calculate split amount
const numberOfOwners = Object.keys(owners).length;
const splitAmount = poolAmount / BigInt(numberOfOwners);

// Function to send USDC
async function sendUSDC(to, amount) {
  const transactionResult = await sender.transfer({
    to,
    amount,
    token: "usdc",
    network: "base-sepolia",
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionResult.transactionHash,
  });

  console.log(`Sent ${amount} USDC to ${to}`);
  console.log(`Transfer status: ${receipt.status}`);
  console.log(`Explorer link: https://sepolia.basescan.org/tx/${receipt.transactionHash}`);
}

// Main distribution function
export default async function distributeUSDC() {
  for (const address of Object.values(owners)) {
    await sendUSDC(address, splitAmount);
  }
}
