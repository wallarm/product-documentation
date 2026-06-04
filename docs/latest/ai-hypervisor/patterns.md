# Patterns <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Patterns** is the central feed of clustered findings on the [Briefing](briefing.md). It occupies the right-side column you read top to bottom when you sign in. [Findings and risk model](findings.md) defines the taxonomy; the [Findings by dimension tile](briefing.md#what-you-see) shows the count rollup; Patterns is the narrative form. Each row describes one repeated, named behaviour AI Hypervisor saw across many sessions, with enough context to decide whether to act.

A Patterns row reads like:

> **Huge** — Unauthenticated API call on `ai-hypervisor-demo` (6,239 sessions) — `ai-hypervisor-demo` → `shadow-ai.svc.cluster.local` — PII redaction
>
> first seen 16h ago

Scan the column from the top to triage the day. Each row links into the underlying session waterfall, the affected entity, or a follow-up action.

## What a pattern is

A pattern is a cluster of similar findings. The clustering engine groups calls that share a destination, a detector signal, a user attribution path, or a verdict shape into one row. Each pattern carries:

* A **severity tag** (`huge`, *high*, *medium*, *low*) reflecting the scale (sessions affected) or the criticality of the underlying finding.
* A **description** in plain language: the short story of what is happening.
* A **session count**: how many distinct sessions the pattern appeared in.
* The **entities** involved: source application, destination host, model provider, MCP server, data class.
* A **first-seen timestamp**.
* Per-row actions: a *History* drawer with every contributing session, and (for actionable patterns) a *Draft policy* chip that pre-fills an Enforcement proposal.

## Pattern types

Patterns fall into a handful of recurring kinds:

* **Shadow exposure.** `<app>` is exposing `<host>`, an AI-shaped API endpoint not in your Registry. Drills into [Shadow AI](shadow-ai.md).
* **Unauthenticated call.** Identity or auth missing on a service-to-service or browser-to-service flow.
* **PII redaction.** Repeated PII detections on the same flow; useful for sizing how often a redaction rule fires.
* **Unsanctioned model in use.** A workload is calling an LLM provider or model that is not in the Sanctioned baseline in [Registry](registry.md).
* **Behavior-cert drift.** An agent is performing actions outside its signed [Behavior Cert](behavior-cert.md).
* **Tool misuse.** An MCP tool is invoked with parameters that violate its declared scope.

## How to use Patterns

The Patterns column is a triage queue. Read it top to bottom. For each row, pick one of:

* **Investigate.** Open the row's session history, or pin the pattern in [Debugger](debugger.md) for follow-up.
* **Promote or sanction.** If the pattern shows something legitimate that was not declared, fix the inventory in [Registry](registry.md).
* **Draft an enforcement rule.** If the pattern should be prevented, the row seeds a proposal for the inline enforcement rule set — see [Enforcement](enforcement.md). Requires the Policies surface to be enabled for your tenant.
* **Dismiss.** False positive or accepted risk. The pattern collapses without losing the underlying audit record.

## Cross-references

| From Patterns | You land in |
|---|---|
| Pattern → session history | [User Tracks](user-tracks.md), filtered to the pattern's sessions |
| Pattern → affected entity | [Registry](registry.md), entity detail |
| Pattern → investigate | [Debugger](debugger.md), pattern pre-pinned |
| Pattern → draft enforcement rule | [Enforcement](enforcement.md), inline rule set |
| Pattern → shadow exposure | [Shadow AI](shadow-ai.md), source signal |
