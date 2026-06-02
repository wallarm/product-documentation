# Supported Model Providers <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

AI Hypervisor inspects outbound calls from instrumented workloads to every major commercial model provider and to self-hosted inference endpoints. Provider detection is automatic — no per-provider configuration is required for discovery or observation.

This page lists the level of inspection AI Hypervisor performs for each supported provider and the configuration knobs that affect a given provider's traffic.

## Provider support matrix

| Provider | Discovery | Per-call inspection | PII detection | Spend tracking |
|---|---|---|---|---|
| Anthropic | ✓ | ✓ | ✓ | — |
| OpenAI | ✓ | ✓ | ✓ | — |
| AWS Bedrock | ✓ | ✓ | ✓ | ✓ |
| Azure OpenAI | ✓ | ✓ | ✓ | — |
| Google Gemini | ✓ | ✓ | ✓ | — |
| Cohere | ✓ | ✓ | ✓ | — |
| Mistral | ✓ | ✓ | ✓ | — |
| Self-hosted (Ollama, vLLM, TGI, OpenAI-compatible endpoints) | ✓ | ✓ | ✓ | — |
| Other (Together, Groq, Replicate, others) | ✓ | Limited — request body recorded, response parsing best-effort | ✓ on detected fields | — |

Columns explained:

* **Discovery** — AI Hypervisor recognizes the provider by request signature (host, path, headers, content shape) and classifies the asset accordingly in [Registry](registry.md).
* **Per-call inspection** — full parsing of prompt, response, model name, token counts. Available for providers whose API schema is built in. Other providers fall back to "limited" mode where the request body is captured as-is.
* **PII detection** — scanning of prompt and response fields for the platform's PII patterns, regardless of provider parsing depth.
* **Spend tracking** — per-call cost attribution. Currently exclusive to AWS Bedrock, which exposes per-invocation cost in its response metadata.

## Provider-specific notes

### Anthropic

Detected on outbound calls to `api.anthropic.com` (and customer-specific gateway hosts where the `anthropic-version` header is set). Full parsing of the Messages API including streaming responses. Tool-use blocks are extracted and surface in [User Tracks](user-tracks.md) as `tool_intent` and `tool_call` steps.

### OpenAI

Detected on outbound calls to `api.openai.com`. Full parsing of Chat Completions, Responses API, and Assistants API. Function-calling responses are extracted into tool-use steps in [User Tracks](user-tracks.md). Embedding calls are detected and counted but do not generate per-step entries.

### AWS Bedrock

Detected on outbound calls to `bedrock-runtime.<region>.amazonaws.com`. The full set of Bedrock-hosted models is supported, including Anthropic Claude variants, Amazon Titan, Cohere Command, AI21 Jamba, Meta Llama, and Mistral models. **Per-invocation cost** is recorded and attributed to the originating user or session — see the Bedrock spend admin page in the tenant UI.

AI Hypervisor has two distinct relationships with Bedrock, and they are independent:

1. **Inspecting customer Bedrock traffic.** When your agents call Bedrock, AI Hypervisor observes the call, parses the request and response, and tracks token usage and cost per call. This is the row above.
2. **Internal Bedrock for AI-powered recommendations.** The per-tenant backend optionally uses Bedrock-hosted Claude to generate plain-language remediation suggestions for findings. The call is made from your AWS account using EKS Pod Identity; no finding payload leaves your cluster, only the finding's metadata. Configurable (on/off) in **Settings**.

You can use AI Hypervisor without ever calling Bedrock yourself, and you can disable the internal Bedrock use without affecting customer-traffic inspection.

### Azure OpenAI

Detected on outbound calls to `*.openai.azure.com`. The deployment name in the URL path is mapped to the underlying model where the platform can resolve it; otherwise the deployment name appears as the model identifier.

### Google Gemini

Detected on outbound calls to `generativelanguage.googleapis.com` and Vertex AI endpoints (`*-aiplatform.googleapis.com`). Both the public Gemini API and Vertex-hosted Gemini deployments are supported.

### Cohere

Detected on outbound calls to `api.cohere.com` and `api.cohere.ai`. The Chat, Generate, and Embed APIs are parsed.

### Mistral

Detected on outbound calls to `api.mistral.ai`. The Chat Completions API and the Embeddings API are parsed.

### Self-hosted endpoints

Self-hosted inference endpoints are detected when the request and response schemas match a known framework (OpenAI-compatible REST, Ollama's API, TGI's `/generate` endpoint, vLLM's OpenAI-compatible mode). The platform tags self-hosted models as such in [Registry](registry.md) so you can scope queries and reports to "external providers only" without including local inference.

### Other providers (Together, Groq, Replicate, and similar)

Providers not in the built-in list are still discovered and observed at the network and request-body level. Per-call parsing is best-effort: the platform attempts to extract the prompt and response from common schemas, and falls back to recording the raw request body for PII detection and rule matching. To add full parsing for a provider not on the list, contact your Wallarm representative.

## How detection works

Provider detection is a runtime classification, not a configuration list. The HIGGS scanner observes each outbound call on the instrumented pod and applies a fingerprinting pass:

1. The **destination host** is matched against a list of well-known provider domains.
2. The **request signature** (path, headers, content type, body schema) is matched against the provider's API patterns.
3. The result is recorded as the asset class `LLM` with a `provider` subtype in [Registry](registry.md).

When a new provider domain appears in your environment that the platform does not recognize, it is classified as `unsanctioned` shadow AI and surfaces in [Heatmap](heatmap.md) under the Shadow risk column. Promote it to `tolerated` or `sanctioned` from [Registry](registry.md) once you have decided on its governance state.

