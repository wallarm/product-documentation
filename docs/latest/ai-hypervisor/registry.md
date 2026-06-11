# Registry <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-executive.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Registry** is the single inventory of every AI, LLM, and MCP component running across your infrastructure: agents, MCP servers, LLM providers, data sources, APIs, tools, and A2AS certificates. One table, one mental model.

**Registry** stays current on its own. The scanner's continuous discovery feeds every new workload, every new vendor call, every new MCP server into the inventory without per-team integration work. Your decisions land per row: promote to managed, leave as shadow, or block.

![AI Hypervisor Registry: a single inventory table of agents, MCP servers, LLM providers, APIs, data sources, and tools with category, type, status, risk, certification, and request-rate columns and per-row Promote actions, beside an all-assets statistics panel showing certification rate and counts of total, sanctioned, tolerated, and unsanctioned assets](../../images/ai-hypervisor/aih-registry.png)

## Governance state

Every entity in the registry carries one of three governance states:

* **Sanctioned.** Explicitly approved into your baseline.
* **Tolerated.** Discovered by the scanner, not yet approved.
* **Unsanctioned.** Observed only via external signals (DNS, cloud audit logs, ingress traffic), with no inventory row. This is shadow AI.

Move entities between states through the per-row **Promote** and **Demote** actions, or bulk-approve everything visible with **Baseline**. Baseline is useful when first onboarding a tenant whose scanner inventory is largely trusted.

## A2AS certification

For agents and MCP servers, the registry tracks **A2AS** (Agent-to-Agent Security) certification: a set of up to five components (Behavior Certificates, Authenticated Prompts, others) that signal an entity has been hardened against agentic-security risks. The **Cert** column summarises how many components are in place per entity. The dedicated **A2AS Certs** tab focuses on certification coverage across all agents.

For tools (MCP-exposed actions agents can call), the equivalent signal is a per-tool *Sanctioned* flag.

## What the registry knows per entity

Beyond the table columns, each entity's detail surfaces include:

* **Owner.** The team or service that operates the entity.
* **Configuration.** Model and version, tools connected, data class, status.
* **Performance.** Recent request rate, latency.
* **A2AS components.** Which certificates are in place and which are missing.
* **CVEs.** Known vulnerabilities affecting the entity's components.
* **Detection source.** For APIs, how AI Hypervisor learned about the endpoint: source-code import, HTTP probing, eBPF observation, or inferred from related traffic.

Exact sections depend on asset class. Agents carry A2AS components and Performance; MCP servers carry transport, tool catalogue, and certification status; APIs carry detection source, protocol, and traffic metrics.

## Cross-references

| From **Registry** | You land in |
|---|---|
| Tool entity → recent invocations | [User Tracks](user-tracks.md), session waterfall |
| High-risk agent or MCP server | [Findings](findings.md) row for the asset domain |
| Shadow or unsanctioned entity | [Topology](topology.md), to see who is talking to it |
| Entity touching PII | [Data Tracks](data-tracks.md), filtered to the entity |

## Settings that affect Registry

* **Scan frequency** ([Settings → Cluster Infrastructure](settings.md#cluster-infrastructure)) controls how quickly newly observed entities enter the inventory.
* The applications visible in the registry are determined by where the scanner is deployed via Helm. Not configurable from the UI.
