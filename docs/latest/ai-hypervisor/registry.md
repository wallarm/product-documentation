# Registry <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

Registry is the **single inventory** of every AI, LLM, and MCP component running across your infrastructure — agents, MCP servers, LLM providers, data sources, APIs, tools, and A2AS certificates. One table, one mental model.

Registry stays current on its own: the scanner's continuous discovery feeds every new workload, every new vendor call, every new MCP server into the inventory without per-team integration work. Your decisions land per row — promote to managed, leave as shadow, or block.

## Governance state

Every entity in the registry carries one of three governance states:

* **Sanctioned** — explicitly approved into your baseline.
* **Tolerated** — discovered by the scanner but not yet approved.
* **Unsanctioned** — observed only via external signals (DNS, cloud audit logs, ingress traffic) with no inventory row at all; this is shadow AI.

You move entities between states through the per-row **Promote** and **Demote** actions, or bulk-approve everything currently visible with the **Baseline** action — useful when first onboarding a tenant whose scanner inventory is largely trusted.

## A2AS certification

For agents and MCP servers, the registry tracks **A2AS** (Agent-to-Agent Security) certification — a set of up to five components (Behavior Certificates, Authenticated Prompts, and others) that signal an entity has been hardened against agentic-security risks. The **Cert** column summarises how many components are in place per entity; the dedicated **A2AS Certs** tab focuses on certification coverage across all agents.

For tools (MCP-exposed actions agents can call), the equivalent signal is a per-tool *Sanctioned* flag.

## What the registry knows per entity

Beyond the row-level columns visible in the table, each entity's detail surfaces include:

* **Owner** — the team or service that operates the entity
* **Configuration** — model and version, tools connected, data class, status
* **Performance** — recent request rate, latency
* **A2AS components** — which certificates are in place and which are missing
* **CVEs** — known vulnerabilities affecting the entity's components
* **Detection source** — for APIs, how the platform learned about the endpoint (source-code import, HTTP probing, eBPF observation, inferred from related traffic)

Exact sections depend on the asset class: agents carry A2AS components and Performance; MCP servers carry transport, tool catalog, and certification status; APIs carry detection source, protocol, and traffic metrics.

## Cross-references

| From Registry | You land in |
|---|---|
| Tool entity → recent invocations | [User Tracks](user-tracks.md), at the session's waterfall |
| High-risk agent or MCP server | [Heatmap](heatmap.md) row for that asset domain |
| Shadow / unsanctioned entity | [Hyper Graph](hyper-graph.md) to see who is talking to it |
| Entity touching PII | [Data Tracks](data-tracks.md) filtered to the entity |

## Settings that affect Registry

* **Scan frequency** (Settings → Cluster Infrastructure) — how quickly newly-observed entities enter the inventory.
* The set of applications visible in the registry is decided by where the scanner has been deployed via Helm — it is not configured from the UI.
