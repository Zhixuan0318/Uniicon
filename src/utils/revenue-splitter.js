import { http, createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import { CdpClient } from "@coinbase/cdp-sdk";

// Set up the public client
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

//Prepare agent evm account
const cdp = new CdpClient();
const accountName = "agent";

// If the account already exists, it will be retrieved.
let sender = await cdp.evm.getOrCreateAccount({
  name: accountName
});
console.log(`Retrieved account with name ${sender.name}.`);
console.log(sender);

const faucetResponse = await cdp.evm.requestFaucet({
  address: sender.address,
  network: "base-sepolia",
  token: "eth"
});
console.log(`Requested funds from ETH faucet: https://sepolia.basescan.org/tx/${faucetResponse.transactionHash}`);


// Define owner addresses
const owners = {
  owner1: "0xB1061f26eDcAD70d33ea4681d96e18F9B5316791"
};

// Define pool amount as 1 USDC (USDC has 6 decimals, so 1 USDC = 1_000_000)
const poolAmount = 50_000n;

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
  console.log(
    `Explorer link: https://sepolia.basescan.org/tx/${receipt.transactionHash}`
  );
}

// Main distribution function
export default async function distributeUSDC() {
  console.log(sender);
  for (const address of Object.values(owners)) {
    await sendUSDC(address, splitAmount);
  }
}
