# Supported Model Providers <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

AI Hypervisor inspects outbound calls from instrumented workloads to every major commercial model provider and to self-hosted inference endpoints. Provider detection is automatic; no per-provider configuration is required for discovery or observation.

This page lists the level of inspection AI Hypervisor performs for each supported provider, plus the configuration knobs that affect a given provider's traffic.

## Provider support matrix

| Provider | Discovery | Per-call inspection | PII detection | Spend tracking |
|---|---|---|---|---|
| Anthropic | ✓ | ✓ | ✓ | — |
| OpenAI | ✓ | ✓ | ✓ | — |
| AWS Bedrock | ✓ | ✓ | ✓ | ✓ |
| Azure OpenAI | ✓ | ✓ | ✓ | — |
| Google Gemini (incl. Vertex) | ✓ | ✓ | ✓ | — |
| Cohere | ✓ | ✓ | ✓ | — |
| Mistral | ✓ | ✓ | ✓ | — |
| Together AI | ✓ | ✓ | ✓ | — |
| Groq | ✓ | ✓ | ✓ | — |
| Hugging Face Inference | ✓ | ✓ | ✓ | — |
| Replicate | ✓ | ✓ | ✓ | — |
| Fireworks AI | ✓ | ✓ | ✓ | — |
| Perplexity | ✓ | ✓ | ✓ | — |
| DeepSeek | ✓ | ✓ | ✓ | — |
| Self-hosted (Ollama, vLLM, llama.cpp, TGI) | ✓ | ✓ | ✓ | — |
| Other (any unrecognised endpoint) | ✓ | Limited: request body recorded, response parsing best-effort | ✓ on detected fields | — |

Columns:

* **Discovery.** AI Hypervisor recognises the provider by request signature (host, path, headers, content shape) and classifies the asset in [Registry](registry.md).
* **Per-call inspection.** Full parsing of prompt, response, model name, and token counts. Available for providers whose API schema is built in. Other providers fall back to "limited" mode where the request body is captured as-is.
* **PII detection.** Scans prompt and response fields for the platform's PII patterns, regardless of parsing depth.
* **Spend tracking.** Per-call cost attribution. Currently AWS Bedrock only; Bedrock exposes per-invocation cost in response metadata.

## Provider-specific notes

### Anthropic

Detected on outbound calls to `api.anthropic.com` (and customer-specific gateway hosts where the `anthropic-version` header is set). Full parsing of the Messages API, including streaming responses. Tool-use blocks are extracted and appear in [User Tracks](user-tracks.md) as `tool_intent` and `tool_call` steps.

### OpenAI

Detected on outbound calls to `api.openai.com`. Full parsing of Chat Completions, Responses API, and Assistants API. Function-calling responses are extracted into tool-use steps in [User Tracks](user-tracks.md). Embedding calls are detected and counted but do not generate per-step entries.

### AWS Bedrock

Detected on outbound calls to `bedrock-runtime.<region>.amazonaws.com`. The full set of Bedrock-hosted models is supported: Anthropic Claude variants, Amazon Titan, Cohere Command, AI21 Jamba, Meta Llama, and Mistral models. Per-invocation cost is recorded and attributed to the originating user or session.

AI Hypervisor has two independent relationships with Bedrock:

1. **Inspecting customer Bedrock traffic.** When your agents call Bedrock, AI Hypervisor observes the call, parses the request and response, and tracks token usage and cost per call. This is the row above.
2. **Internal Bedrock for AI-powered recommendations.** The per-tenant backend optionally uses Bedrock-hosted Claude to generate remediation suggestions for findings. The call is made from your AWS account using EKS Pod Identity. Only finding metadata is sent; no finding payload leaves your cluster. Configurable in **Settings**.

You can use AI Hypervisor without ever calling Bedrock yourself, and you can disable internal Bedrock use without affecting customer-traffic inspection.

### Azure OpenAI

Detected on outbound calls to `*.openai.azure.com`. The deployment name in the URL path is mapped to the underlying model when the platform can resolve it; otherwise the deployment name appears as the model identifier.

### Google Gemini

Detected on outbound calls to `generativelanguage.googleapis.com` and Vertex AI endpoints (`*-aiplatform.googleapis.com`). Both the public Gemini API and Vertex-hosted Gemini deployments are supported.

### Cohere

Detected on outbound calls to `api.cohere.com` and `api.cohere.ai`. The Chat, Generate, and Embed APIs are parsed.

### Mistral

Detected on outbound calls to `api.mistral.ai`. The Chat Completions API and the Embeddings API are parsed.

### Together AI

Detected on outbound calls to `api.together.xyz` and `api.together.ai`. The OpenAI-compatible Chat Completions API and Together's native model-endpoint API are parsed.

### Other built-in providers

These providers have built-in detection signatures, so per-call inspection is full (not best-effort): **Groq** (`api.groq.com`), **Hugging Face Inference** (`api-inference.huggingface.co`), **Replicate** (`api.replicate.com`), **Fireworks AI** (`api.fireworks.ai`), **Perplexity** (`api.perplexity.ai`), **DeepSeek** (`api.deepseek.com`).

### Self-hosted endpoints

Self-hosted inference endpoints are detected when the request and response schemas match a known framework: **Ollama** (default port 11434), **vLLM** in OpenAI-compatible mode (8000), **llama.cpp** (8080), and **TGI**'s `/generate` endpoint. AI Hypervisor tags self-hosted models as such in [Registry](registry.md), so you can scope queries and reports to *external providers only* without including local inference.

### Other providers

Providers not in the built-in list are still discovered and observed at the network and request-body level. Per-call parsing is best-effort: AI Hypervisor extracts prompt and response from common schemas, and falls back to recording the raw request body for PII detection and rule matching. To add full parsing for a provider not on the list, [contact Wallarm](https://www.wallarm.com/contact/ai-hypervisor).

## How detection works

Provider detection is a runtime classification, not a configuration list. The HIGGS Scanner observes each outbound call on the instrumented pod and runs a fingerprinting pass:

1. The destination host is matched against a list of known provider domains.
2. The request signature (path, headers, content type, body schema) is matched against the provider's API patterns.
3. The result is recorded as asset class `LLM` with a `provider` subtype in [Registry](registry.md).

When a new provider domain appears that AI Hypervisor does not recognise, it is classified as `unsanctioned` shadow AI and surfaces in [Findings](findings.md) under the Shadow risk column. Promote it to `tolerated` or `sanctioned` from [Registry](registry.md) once you have decided on its governance state.
