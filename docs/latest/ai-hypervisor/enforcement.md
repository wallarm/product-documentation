# Enforcement <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

AI Hypervisor enforces policy at runtime through two primitives that operate at different time horizons:

* **Kill Session** — an **immediate, kernel-level termination** of an active session. Production-grade; ships in the current release.
* **Policies** — **prospective rules** that block, redact, or alert on outbound calls matching a pattern. Surfaced through the **Policies** view, currently feature-flagged.

Together they cover *"stop this one session right now"* (Kill Session) and *"never let this pattern through again"* (Policies).

## Kill Session

When a session is misbehaving in real time — a jailbroken agent, an over-permissioned tool sequence, an active data-exfiltration attempt — block rules alone are not always enough. The session may already have an open connection to a model provider, or be mid-stream on a tool call. Kill Session terminates every active connection of that session at the kernel level, immediately.

### How it works

The HIGGS Scanner instruments each pod via eBPF. Kernel-side TCP tracepoints record the relationship between each outbound socket and the originating session ID (stitched from request headers, user identity, and trace correlation). When you invoke **Kill Session** in [User Tracks](user-tracks.md), the scanner:

1. Looks up every TCP connection whose session ID matches the target.
2. Issues a kernel-level `SO_LINGER`-zero close on each matching socket — the connection is reset, not drained.
3. Marks the session as `killed` in the backend, with the reason you supplied.
4. Preserves the full waterfall up to the kill point for post-incident review.

No pod restart, no deploy cycle, no impact on other sessions in the same pod. Other workloads remain undisturbed.

### When to use Kill Session

* A session is producing visibly bad output (jailbroken agent, off-policy tool calls) and there is no time to author a new policy.
* A data-exfiltration pattern is detected mid-flight and the egress connection must be torn down immediately.
* An incident-response team needs a stop-the-bleeding action before forensic review.

For systemic patterns — the same bad behaviour across many sessions — author a policy rather than killing each session individually. Kill Session is an incident control, not a policy mechanism.

### What the agent sees

The agent's connection terminates with `ECONNRESET`. Most LLM SDKs surface this as a retryable network error. Application code that retries unconditionally may attempt the same call again — depending on your topology, the retry either matches a policy (and is rejected) or hits a fresh session ID (and runs normally). For consistent enforcement of intent, combine the kill action with a policy that prevents the next attempt.

## Policies

The **Policies** view in the [Briefing](briefing.md) tray is the policy-management surface. A policy is a pattern, a destination scope, and an action; when an outbound call from an instrumented workload matches all three, the call is rejected, redacted, or alerted on at the egress boundary before it reaches the model provider.

!!! info "Availability"
    The Policies view and the underlying pattern-match enforcement engine are **feature-flagged** in the current release. Wallarm enables them per tenant on request. The underlying engine runs in every scanner deployment, but the customer-facing rule editor and active-policy table are gated behind the feature flag.

### Policy lifecycle

Policies move through five states, each surfaced as a sub-tab in the Policies view:

* **Active** — currently in force. The Disable action revokes a policy without deleting it.
* **Pending** — drafted (often by the platform itself as an *agent-drafted policy*) and awaiting human approval before activation.
* **Watching** — applied in observe-only mode; the platform records what *would* have matched, without taking action. Use this to baseline a policy's match rate before flipping to Active.
* **Declined** — proposals you have rejected. Kept for audit.
* **Certs** — A2AS Behavior Certificates per agent: signed declarations of the actions an agent is meant to take. Drift between a cert and observed behaviour is what drives most Pending policies.

### Anatomy of a policy

* **Pattern** — a regular expression evaluated against a specified field (`prompt`, `tool_input`, `tool_output`, `headers`, `body`).
* **Field** — the part of the call to inspect. For LLM calls, common fields are `prompt` and `response`. For MCP tool calls, `tool_input` and `tool_output`.
* **Destination scope** — which downstream targets the rule applies to: a specific asset, an asset class (`LLM`, `MCP`, `API`, `Data`), or all destinations.
* **Action** — `block` (reject and surface as error to the agent), `redact` (replace matched substrings with a configured token), or `alert` (log without altering).
* **Severity** — `low` / `medium` / `high` / `critical`, drives how the resulting finding rolls up on [Heatmap](heatmap.md).

Policies are evaluated in order until the first match. If no policy matches, the call is allowed by default.

## Putting them together

The two primitives cover different time horizons:

* **Policies** are *prospective* — they prevent the next call that matches. Use them for policy: *"no credit-card numbers in prompts to external LLMs"*, *"no calls to unsanctioned providers"*.
* **Kill Session** is *immediate* — it stops the current call. Use it for incident response: *"this session is doing something we did not anticipate; cut it now."*

A mature deployment runs many policies and rarely needs Kill Session. Early deployments often need Kill Session frequently while the policy library is built up.

## Cross-references

* [User Tracks](user-tracks.md) — where Kill Session lives, and where killed sessions surface
* [Data Tracks](data-tracks.md) — per-flow records of what a policy produced
* [Briefing](briefing.md) — where the Policies view lives
* [Reports](reports.md) — how enforcement events flow into audit reports
