# User Tracks <a href="overview.md#subscription"><img src="../../images/ai-hypervisor-tag.svg" style="border: none;"></a>

User Tracks is the **session-level evidence view** — every user-to-agent or agent-to-agent interaction as a discrete session, with the full chain from prompt through tool calls through responses, plus the PII profile and step-level evidence.

The page has two complementary views: **Sessions** follows agent sessions end-to-end; **Sensitive data** follows individual PII records across sessions.

## What a session record contains

For every session the platform reconstructs the chronological waterfall — every step in order, each with its own evidence. Step types include user prompts, agent thoughts, LLM calls, tool intents, tool calls, MCP responses, API calls, responses, and errors; the exact sequence depends on what the session did.

Per session, the platform records:

* **User identity** — the calling end user, stitched across every internal service hop (see [Cross-hop attribution](#how-user-attribution-works-across-service-hops) below).
* **Applications** touched — one or several, when the session crossed multiple apps via linked traces.
* **Tool-call count** and **PII presence** indicators.
* **Status** — `active`, `completed`, `error`, or `timeout`.
* **Per-step evidence** — the prompt or payload, the step's status, and any PII the platform detected in the payload.

## Sensitive data view

Switching the page to *Sensitive data* follows individual PII records — a tracked email, an SSN, a token — rather than agent sessions. Each record carries:

* **Data class** and the masked value
* **Risk score** derived from how the record has been accessed
* **Access count** — how many times the record was observed in motion
* **Unique-agents count** — how many distinct agents have touched it
* A **journey of events** — the timeline of accesses across sessions

This is the right view for *"who has touched this customer's data, when, and how"* — sessions are useful when investigating an incident, individual records are useful when answering a subject-access request or proving non-egress.

## How user attribution works across service hops

When a session crosses multiple services — for example, a browser request enters service A, which calls service B, which calls an LLM — AI Hypervisor stitches the same user identity across all three hops, so the downstream LLM call is attributed to the original caller even when the intermediate services did not forward the identity.

Stitching works in two complementary ways:

1. **Trace correlation** — when the request carries a W3C `traceparent` header, the scanner reads it and joins on the trace ID.
2. **Kernel TID correlation** — for services that do not propagate trace headers, the scanner correlates outbound socket activity to the inbound request via the kernel thread ID and a short observation window.

The result is the per-session waterfall described above: the original user's identity is attached to every step the session triggered, regardless of how many service hops separate the entry point from the model call.

## Cross-references

| From User Tracks | You land in |
|---|---|
| Session → trace on graph | [Data Tracks](data-tracks.md), filtered to the flow this session traversed |
| Sensitive-data record → trace flow | [Data Tracks](data-tracks.md), filtered to the flow that produced the PII record |
| Calling agent | [Registry](registry.md), agent detail |
| Session-derived compliance evidence | [Reports](reports.md) |

## Settings that affect User Tracks

* **Scan frequency** ([Settings → Cluster Infrastructure](settings.md#cluster-infrastructure)) — how quickly new sessions appear.
* The applications and namespaces observed are decided by where the scanner is deployed and which workloads carry the `higgs.scan=enabled` label — see [Labels and Annotations](annotations.md).
