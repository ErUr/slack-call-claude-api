import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import Anthropic from "npm:@anthropic-ai/sdk";

export const CallClaudeAPIDefinition = DefineFunction({
  callback_id: "call_claude_api",
  title: 'Call Claude "Create a Message" API',
  description:
    "Calls the Anthropic Create a Message API with the given parameters and returns the output",
  source_file: "call_claude_api.ts",
  input_parameters: {
    properties: {
      model: {
        type: Schema.types.string,
        enum: [
          "claude-3-opus-20240229",
          "claude-3-sonnet-20240229",
          "claude-3-haiku-20240307",
        ],
        choices: [{
          title: "Claude 3 Opus",
          value: "claude-3-opus-20240229",
          description: "Claude 3 Opus 20240229",
        }, {
          title: "Claude 3 Sonnet",
          value: "claude-3-sonnet-20240229",
          description: "Claude 3 Sonnet 20240229",
        }, {
          title: "Claude 3 Haiku",
          value: "claude-3-haiku-20240307",
          description: "Claude 3 Haiku 20240307",
        }],
      },
      message: {
        type: Schema.types.string,
        description: 'Initial message with "user" role',
      },
      max_tokens: {
        type: Schema.types.integer,
        maximum: 4096,
        minimum: 8,
        description: "The maximum number of tokens to generate before stopping",
      },
      system: {
        type: Schema.types.string,
        description: "The system prompt",
      },
      temperature: {
        type: Schema.types.number,
        maximum: 2,
        minimum: 0,
        description:
          "Amount of randomness injected into the response - ranging from 0.0 to 1.0",
      },
      top_k: {
        type: Schema.types.integer,
        minimum: 0,
        description:
          "Only sample from the top K options for each subsequent token - leave empty or see API docs if you don't know what this means.",
      },
      top_p: {
        type: Schema.types.number,
        minimum: 0,
        description:
          "Use nucleus sampling - leave empty or see API docs if you don't know what this means.",
      },
    },
    required: ["model", "message", "max_tokens"],
  },
  output_parameters: {
    properties: {
      output: {
        type: Schema.types.string,
        description: "Model output",
      },
      model: {
        type: Schema.types.string,
        enum: [
          "claude-3-opus-20240229",
          "claude-3-sonnet-20240229",
          "claude-3-haiku-20240307",
        ],
        choices: [{
          title: "Claude 3 Opus",
          value: "claude-3-opus-20240229",
          description: "Claude 3 Opus 20240229",
        }, {
          title: "Claude 3 Sonnet",
          value: "claude-3-sonnet-20240229",
          description: "Claude 3 Sonnet 20240229",
        }, {
          title: "Claude 3 Haiku",
          value: "claude-3-haiku-20240307",
          description: "Claude 3 Haiku 20240307",
        }],
      },
      tokens_used_input: {
        type: Schema.types.integer,
        description: "Number of input tokens used",
      },
      tokens_used_output: {
        type: Schema.types.integer,
        description: "Number of output tokens used",
      },
    },
    required: ["output", "model", "tokens_used_input", "tokens_used_output"],
  },
});

export default SlackFunction(
  CallClaudeAPIDefinition,
  async ({ inputs, env }) => {
    try {
      const anthropic = new Anthropic({
        apiKey: env.ANTHROPIC_API_KEY,
        baseURL: "https://api.anthropic.com", // to avoid env access that would confuse Slack
        authToken: null, // to avoid env access that would confuse Slack
      });
      const msg = await anthropic.messages.create({
        model: inputs.model,
        max_tokens: inputs.max_tokens,
        messages: [{ role: "user", content: inputs.message }],
        system: inputs.system,
        temperature: inputs.temperature,
        top_k: inputs.top_k,
        top_p: inputs.top_p,
      });
      return {
        outputs: {
          output: msg.content[0].text,
          model: msg.model,
          tokens_used_input: msg.usage.input_tokens,
          tokens_used_output: msg.usage.output_tokens,
        },
      };
    } catch (e) {
      return {
        error: `Error calling API: ${e}`,
      };
    }
  },
);
