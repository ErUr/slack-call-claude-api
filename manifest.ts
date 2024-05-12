import { Manifest } from "deno-slack-sdk/mod.ts";
import { CallClaudeAPIDefinition } from "./call_claude_api.ts";

export default Manifest({
  name: "Call the Anthropic API",
  description: "A Slack function step that allows you to invoke Claude",
  icon: "icon.png",
  workflows: [],
  outgoingDomains: ["api.anthropic.com", "registry.npmjs.org"],
  datastores: [],
  functions: [CallClaudeAPIDefinition],
  botScopes: ["app_mentions:read"],
});
