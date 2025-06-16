import { NextResponse } from "next/server";
import { PinataSDK } from "pinata";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import contractABI from "@/contract/abi.json";
import "dotenv/config";

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "chocolate-magnetic-scorpion-427.mypinata.cloud",
});

// Environment variables
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

export async function POST(req) {
  try {
    const { url, address } = await req.json();

    if (!url || !address) {
      return NextResponse.json(
        { error: "Both URL and wallet address are required." },
        { status: 400 }
      );
    }

    // 1. Create metadata using the direct URL
    const metadata = {
      name: "3D Animated Icon",
      description: "A unique 3D animated icon minted as an NFT.",
      animation_url: url,
    };

    // 2. Upload metadata JSON to Pinata
    const uploadResult = await pinata.upload.public.json(metadata);
    const metadataCid = uploadResult.cid;
    const tokenURI = `https://${pinata.pinataGateway}/ipfs/${metadataCid}`;

    // 3. Connect to Ethereum and mint the NFT
    const provider = new JsonRpcProvider(RPC_URL);
    const wallet = new Wallet(PRIVATE_KEY, provider);
    const contract = new Contract(CONTRACT_ADDRESS, contractABI, wallet);

    const tx = await contract.mint(address, tokenURI);
    await tx.wait();

    return NextResponse.json({
      success: true,
      metadataCid,
      tokenURI,
      txHash: tx.hash,
    });
  } catch (error) {
    console.error("Minting error:", error);
    return NextResponse.json(
      { error: "Failed to upload metadata and mint NFT." },
      { status: 500 }
    );
  }
}
