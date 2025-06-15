import animate from "../../../utils/animate.js";
import generate from "../../../utils/generate.js";
import clean from "../../../utils/cleaner.js";
import extract from "../../../utils/extract.js";
import interpret from "../../../utils/interpret.js";
import planner from "../../../utils/planner.js";
import distributeUSDC from "@/utils/revenue-splitter.js";

export async function POST(request) {
  try {
    const { input } = await request.json();

    console.log("Extracting client's required icon...");
    const extractedData = await extract(input);

    console.log("Generating icon illustration...");
    const base64Image = await generate(extractedData);
    const imageBuffer = Buffer.from(base64Image, "base64");

    console.log("Cleaning up icon background...");
    const cleanImageBuffer = await clean(imageBuffer);

    console.log("Intepreting icon design...");
    const interpretedText = await interpret(imageBuffer);

    console.log("Planning icon animation...");
    const planText = await planner(interpretedText);

    console.log("Start animating icon...");
    const animationResult = await animate(cleanImageBuffer, planText);

    console.log("Distributing revenue...");
    await distributeUSDC();

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // const animationResult = "https://sfdylvwdndtsj1a0.public.blob.vercel-storage.com/animated-icon/chicken-5jl2UpHPgBCDSiAaScvR1HOORx6dJU.mp4";

    return Response.json({ result: animationResult });
  } catch (error) {
    console.error("Error in protected workflow:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}