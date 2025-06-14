import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor } from "x402-axios";
import { config } from "dotenv";

config();

const privateKey = process.env.PRIVATE_KEY;
const baseURL = process.env.RESOURCE_SERVER_URL; 
const endpointPath = process.env.ENDPOINT_PATH;

if (!privateKey || !baseURL || !endpointPath) {
  throw new Error("Missing environment variables");
}

// Create a wallet client to handle payments
const account = privateKeyToAccount(privateKey);

// Create an axios client with payment interceptor using x402-axios
const client = withPaymentInterceptor(axios.create({ baseURL }), account);

const server = new McpServer({
  name: "Animated Icon Generator",
  version: "1.0.0",
});

server.tool(
  "generate-animated-icon",
  "Generate a 3D animated icon based on user input and return a video link.",
  {
    input: {
      type: "text",
      description: "Prompt or description of the icon to generate (e.g. 'a dancing chicken')",
    },
  },
  async ({ input }) => {

    console.error("Tool invoked with input:", input);
    try {
      const res = await client.post(endpointPath, { input });

      if (!res.data?.result) {
        throw new Error("No result returned from icon server");
      }

      return {
        content: [
          {
            type: "text",
            text: `Here is your animated icon: ${res.data.result}`,
          },
        ],
      };
    } catch (error) {
      console.error("Generation failed:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to generate icon: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

// Connect to MCP transport
const transport = new StdioServerTransport();
await server.connect(transport);