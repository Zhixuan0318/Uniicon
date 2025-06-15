import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from "uuid";

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION,
});

const agentId = "0J7FNY92CR";
const agentAliasId = "EPB38RI5YO";

export default async function extract(inputText) {
  const sessionId = uuidv4();

  const command = new InvokeAgentCommand({
    agentId,
    agentAliasId,
    sessionId,
    inputText: inputText,
  });

  try {
    const response = await client.send(command);

    let result = "";

    for await (const event of response.completion) {
      if (event.chunk?.bytes) {
        result += Buffer.from(event.chunk.bytes).toString();
      }
    }

    return result;
  } catch (error) {
    console.error("Error invoking agent:", error);
    throw error;
  }
}
