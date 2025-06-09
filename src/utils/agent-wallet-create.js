import { CdpClient } from "@coinbase/cdp-sdk";
import dotenv from "dotenv";

dotenv.config();

const cdp = new CdpClient();

const account = await cdp.evm.createAccount();
const faucetResponse = await cdp.evm.requestFaucet({
  address: account.address,
  network: "base-sepolia",
  token: "eth"
});
console.log(`Requested funds from ETH faucet: https://sepolia.basescan.org/tx/${faucetResponse.transactionHash}`);