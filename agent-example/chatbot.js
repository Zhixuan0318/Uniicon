import readline from "readline";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import {
  createOpenAIToolsAgent,
  AgentExecutor,
} from "langchain/agents";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { wrapFetchWithPayment } from "x402-fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

// Load environment variables
dotenv.config();

// 1. Set up wallet
const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("❌ Missing PRIVATE_KEY");
  process.exit(1);
}
const account = privateKeyToAccount(PRIVATE_KEY);
const wallet = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

console.log("✅ Wallet ready:", account.address);

// 3. Set up fetchWithPayment
const fetchWithPayment = wrapFetchWithPayment(fetch, wallet);

// 4. Create the animated icon tool
const animatedIconTool = new DynamicStructuredTool({
  name: "generate_animated_icon",
  description: "Generate a 3D animated icon video from a text prompt.",
  schema: z.object({
    input: z.string().describe("A description of what icon to generate"),
  }),
  func: async ({ input }) => {
    console.log("Resources gated with x402. Made payment to access.");
    const res = await fetchWithPayment("http://localhost:3000/api/protected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Tool call failed");
    }

    const data = await res.json();
    return `Video URL: ${data.result}`;
  },
});

// 5. Set up the LLM + agent
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

const tool = convertToOpenAITool(animatedIconTool);
const prompt = await pull("hwchase17/openai-functions-agent");

const agent = await createOpenAIToolsAgent({
  llm,
  tools: [tool],
  prompt,
});

const executor = new AgentExecutor({
  agent,
  tools: [animatedIconTool],
  verbose: false, // No thinking logs
});

// 6. CLI chatbot
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

console.log(
  "\n🤖 Hello! I can generate animated icons for you.\nAsk me something like: `make me an icon of a chicken dancing`\n"
);

while (true) {
  const userInput = await ask("> ");
  if (!userInput.trim()) continue;

  try {
    console.log("Processing Request... (Approx: 2 mins)");
    const result = await executor.invoke({ input: userInput });
    console.log("\n🧠 Chatbot Response:", result.output, "\n");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}
