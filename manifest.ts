import { Manifest } from "deno-slack-sdk/mod.ts";
import { CallClaudeAPIDefinition } from "./call_claude_api.ts";

export default Manifest({
  name: "Anthropic",
  description: "Message with Claude via the Anthropic 1st party API",
  icon: "icon.png",
  workflows: [],
  outgoingDomains: ["api.anthropic.com", "registry.npmjs.org"],
  datastores: [],
  functions: [CallClaudeAPIDefinition],
  botScopes: ["app_mentions:read"],
});
