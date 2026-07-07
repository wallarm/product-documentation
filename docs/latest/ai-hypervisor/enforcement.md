# Enforcement <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

AI Hypervisor enforces policy at runtime through the HIGGS Scanner. The enforcement engine ships in every scanner deployment; the operator-facing UI controls that drive it are enabled per tenant by Wallarm. This page describes what the engine can do, how to opt a workload in, and which surfaces in the default UI drive enforcement today.

## Capabilities

The scanner provides three enforcement primitives, each operating at a different layer of the stack:

* **Namespace quarantine.** Block all egress to AI providers from a namespace that has not been brought under coverage. Implemented at the kernel level on the scanner DaemonSet (cgroup_skb drop on the target pods). Used by the **Enforce** action in [Shadow AI](shadow-ai.md).
* **Inline call enforcement.** Outbound HTTPS to model providers is transparently re-routed through a per-node MITM proxy, where rules match on prompt, response, tool input or output, and other parsed fields. Actions are **block** (reject and surface as error to the agent), **redact** (replace the matched substring), or **alert** (log without altering). Rule matching is local to the proxy — sub-millisecond, no backend round-trip per call.
* **Session-level termination.** Reset every open TCP connection of a misbehaving session at the kernel level via eBPF, without touching other sessions on the same pod. Used when policy alone is not enough and the active session must stop now.

The first two are *prospective* — they stop the next call that matches. The third is *immediate* — it stops the current call.

### How session-level termination is implemented

The scanner attaches eBPF programs to TCP egress hooks on each instrumented pod. Every outbound connection is recorded in an in-kernel map keyed by connection tuple (source IP, source port, destination, PID), with the session ID the scanner has stitched for that flow attached. A second map carries the per-session verdict: `allow` (default) or `block`.

When the verdict for a session flips to `block` — because an operator pressed **Kill Session** in [User Tracks](user-tracks.md), or because an inline rule fired on a call inside that session — the eBPF program emits a TCP **RST** on the next packet of every matching connection instead of forwarding it. The connection is reset, not drained: the agent sees `ECONNRESET` on every active socket of that session within one round-trip. Other sessions on the same pod, and sessions of other pods on the same node, are untouched.

The same eBPF path handles two cases:

* *Block this session now* (operator-initiated, from a session row).
* *Block calls matching this inline rule from now on* (rule-initiated, after the proxy detects a match the scanner sets the verdict for that session).

The verdict map is queried by the local MITM proxy over a localhost endpoint (`GET /api/policy?src_ip=…`), so HTTPS sessions are caught at the proxy layer in addition to the kernel-level RST — the proxy refuses to relay the bytes onward and the kernel reset stops any retry attempt on the same socket.

## Opting workloads in

Enforcement is a per-workload opt-in, separate from observation. The labels are independent so you can run a workload in observe-only mode for as long as you need before applying any controls.

| Label | Effect |
|---|---|
| `higgs.scan=enabled` | Observation only — the scanner captures sessions, attributes calls, detects PII. No enforcement. |
| `higgs.io/enforce=enabled` | Observation + enforcement. The scanner adds DNAT rules that route outbound LLM traffic through the local MITM proxy, where the in-proxy rule set decides block / redact / alert. |

Both labels apply at pod or namespace scope. A namespace-level label applies to every pod in the namespace. See [Labels and Annotations](annotations.md) for the full list and precedence.

Applying `higgs.io/enforce=enabled` triggers a scanner reconfiguration within ~30 seconds — no pod restart, no Helm operation. Removing the label or replacing it with `=disabled` rolls the workload back to observation-only.

## How enforcement surfaces in the default UI

Several surfaces drive the enforcement engine in the current release:

* **Per-finding "Block …" buttons in the *Needs a decision* panel.** Each finding row on the [Briefing](briefing.md) carries its own action button, and the label is chosen from the finding's category — different rows in the same panel show different labels. Confirmed mappings include:

    | Finding category | Button label |
    |---|---|
    | `pii` | *Block PII egress* |
    | `auth` | *Block unauthenticated calls* |
    | `access` | *Block this target* |
    | `injection` | *Block the injection vector* |

    Other dimensions on the [Findings model](findings.md) (threat, anomaly, shadow, supply, cert, compliance, fidelity) carry their own category-specific actions on the rows they produce.

    Pressing the button takes the matching pattern from the finding (for example, the prompt-injection score threshold *≥ 50*, or the destination host from an access finding) and adds it as an active inline rule that fires across every app from that moment on. A typical *Needs a decision* panel surfaces many rows from multiple categories simultaneously, so multiple *Block …* actions are usually visible at once.
* **[Shadow AI](shadow-ai.md) → Enforce on a namespace card.** Applies the namespace-quarantine primitive to every workload in the namespace. Subsequent egress to AI providers from that namespace is dropped at the kernel level.
* **Session-level Kill Session.** Lives on a session row in [User Tracks](user-tracks.md). The UI button is feature-flagged off by default; Wallarm enables it per tenant once safety guardrails are validated for your deployment. The scanner-side primitive — eBPF-based session termination — is always present.
* **Policies tray card in the Briefing.** A scoped view of the inline rule set, available in the [Briefing](briefing.md) action bar when enabled. Also enabled per tenant by Wallarm.

For roles that do not see these surfaces directly, the engine still operates on every labeled workload — the absence of a UI control does not mean the absence of enforcement.

## What the agent sees when something is blocked

The exact failure surface depends on which primitive fired:

* **Namespace quarantine.** Outbound connections to AI provider domains fail at connect time. Most SDKs surface this as `ECONNREFUSED` or DNS-resolution failure if the resolver itself is short-circuited.
* **Inline block.** The proxy returns a synthetic error response to the agent (HTTP 4xx with a structured body for OpenAI-shaped APIs, `tool_result.is_error=true` for MCP tool calls). The model provider never sees the call.
* **Session termination.** Every open connection of the session terminates with `ECONNRESET`. SDKs surface this as a retryable network error; depending on retry behavior, the next attempt either matches an inline rule (and is rejected) or hits a fresh session ID.

Application code that retries unconditionally may still complete the action on a fresh session. For consistent enforcement of intent, pair the session kill with an inline rule that prevents the next attempt.

## Auditability

Every enforcement decision is logged. The proxy emits one record per evaluated call (matched rule, action taken, latency); the kernel-side quarantine emits a record per first-blocked connection; session terminations emit a record per killed session. Records carry the rule identifier, the operator who applied the rule, and a hash of the matched field. They appear in [Notifications](notifications.md), in the per-app finding feed, and in the audit trail packaged by [Compliance](compliance.md).

## Cross-references

| From Enforcement-driven event | You land in |
|---|---|
| Blocked egress from a quarantined namespace | [Shadow AI](shadow-ai.md), the namespace card |
| Inline block / redact / alert on a call | [User Tracks](user-tracks.md), the session that triggered the rule |
| Drift-triggered rule proposal | [Patterns](patterns.md), the originating Behavior-cert drift pattern |
| Audit evidence of an enforcement event | [Compliance](compliance.md), the evidence pack |
