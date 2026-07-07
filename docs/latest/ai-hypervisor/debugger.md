# Debugger <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Debugger** is the low-level event and asset browser of AI Hypervisor. It aggregates everything the scanner has emitted across every observed application into a single sortable table. When the [Briefing](briefing.md) and the per-app views give you the rolled-up picture, Debugger is where you go to read the raw stream.

The view opens in **Aggregate** mode by default, scoped to all applications. The footer shows when the aggregate view was last refreshed (for example, *Updated 543s ago*).

## Tabs

A tab strip across the top selects what to display. Each tab queries a different backend collection:

* **Events** — the default. A reverse-chronological stream of everything the scanner emitted: PII detections, high-severity CVE matches, policy hits, scanner-health events.
* **Data providers** — databases and data stores observed as call targets.
* **MCP servers** — every MCP server discovered, whether sanctioned or shadow.
* **Agents** — every agent identified by the in-process introspection.
* **Core platform APIs** — internal APIs your applications expose.
* **External APIs** — third-party APIs your applications call out to.
* **User APIs** — APIs reached from a user-attributable session.
* **App platform** — platform addons in use (Bedrock, language runtimes).
* **LLM** — model providers and self-hosted inference endpoints, with usage counts.
* **Topology API** — graph-shaped view of cross-service edges. The counter on the right (for example, *0 topology nodes*) reflects what is in scope under the current filter.
* **Infrastructure** — node, kernel, and DaemonSet state.
* **Audit** — administrative actions (settings changes, member additions, scanner pauses).

## The Events table

The default **Events** tab renders five columns:

| Column | Content |
|---|---|
| **Message** | Human-readable summary. Examples: `PII/Secrets Detected`, `High severity: DEBIAN-CVE-2026-41989`. |
| **Type** | Machine code for the event class: `pii_detected`, `high_cve`, `policy_hit`, `scanner_offline`, and so on. |
| **Severity** | Critical / High / Medium / Low / Informational, with the canonical severity chip. |
| **Source** | The component or workload that emitted the event (for example, `ai-gateway`). |
| **Time** | Absolute timestamp. |

Each column has a per-column **SHOW** control at the bottom for hiding it from view without changing the underlying query.

## When Debugger is the right tool

* You opened a finding in [Findings](findings.md) and want to see every related event around the same time window.
* You are auditing how often a specific CVE or PII rule fired across applications, not just inside one app's [Topology](topology.md).
* You suspect a scanner-side issue and need to see the raw `scanner_offline` or `pulse` events.
* You want to verify what the Infrastructure or Audit feeds recorded after a configuration change.

For per-application drill-down with sessions and traces, work from [Registry](registry.md). For an audit-grade artifact, use [Compliance](compliance.md).

## Cross-references

| From Debugger | You land in |
|---|---|
| `pii_detected` event | [User Tracks](user-tracks.md), the session that triggered it |
| `high_cve` event | [Supply Chain](supply-chain.md), the vulnerable component |
| Topology API node | [Topology](topology.md), the node in graph view |
| Agent row | [Registry](registry.md), the agent detail |
| Audit row | [Settings](settings.md), the surface where the change was made |
