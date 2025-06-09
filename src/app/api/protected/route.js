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

    // await new Promise(resolve => setTimeout(resolve, 120000));
    // const extractedData = await extract(input);
    // const base64Image = await generate(extractedData);
    // const imageBuffer = Buffer.from(base64Image, "base64");
    // const cleanImageBuffer = await clean(imageBuffer);
    // const interpretedText = await interpret(imageBuffer);
    // const planText = await planner(interpretedText);
    // const animationResult = await animate(cleanImageBuffer, planText);
    await distributeUSDC();

    return Response.json({ result: input });
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