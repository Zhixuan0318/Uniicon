import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Setup Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Handle POST request
export async function POST(req) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    const key = `trial-${address}`;
    const usage = await redis.get(key);

    if (!usage || usage <= 0) {
      return NextResponse.json({ allowed: false });
    }

    // Decrement usage count
    await redis.decr(key);

    return NextResponse.json({ allowed: true });
  } catch (err) {
    console.error("Error checking trial:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
