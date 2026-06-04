# Topology <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Topology** is the traffic-flow map of your environment: how requests move between agents, MCP servers, LLM providers, data sources, and APIs. It shows the same entities as [Registry](registry.md), but emphasises the connections between them.

A node is one observed entity; an edge is a flow between two of them. Node severities aggregate the findings on that entity. Edge severities surface PII, unsanctioned destinations, and other per-flow concerns.

## Layers and zones

Nodes sit on a two-dimensional grid that matches the [Findings](findings.md) full-stack lens:

* **Layers** (functional role): Interface, Identity, Orchestration, Guardrails, Inference, Protocol (MCP), Connectivity, Knowledge, Infrastructure.
* **Zones** (infrastructure boundary): Core platform, Cloud services, App platform, External.

Read the canvas top to bottom to follow a request from the public entry point through identity, orchestration, and inference towards data. Read left to right to see what stays inside your platform versus what reaches out to third-party services.

A complementary **Flow** view renders the same nodes and edges as a directional tree, emphasising the path traffic takes rather than the architectural layout.

## Pipelines

A **pipeline** is a user-defined label that groups several agentic flows into one named business-process view (for example, `checkout-bot RAG flow`). Once defined, the pipeline appears as a node on the canvas and rolls up totals (requests per minute, daily cost estimate, PII-carrying flow count) in the Pipeline overview block.

Pipelines are optional. **Topology** is fully usable without them, showing raw per-entity nodes and edges.

## Governance filter and baselining

**Topology** respects the same three governance states as [Registry](registry.md): Sanctioned, Tolerated, Unsanctioned. A per-app governance filter shows or hides nodes by state. The **Baseline inventory** action bulk-promotes every Tolerated agent and MCP server in the current application to Sanctioned. Useful right after deploying the scanner to a new application, when reviewing the inventory is faster than promoting each row individually in **Registry**.

## Cross-references

| From **Topology** | You land in |
|---|---|
| Edge click | [Data Tracks](data-tracks.md), flow detail for the edge |
| Node detail → recent sessions | [User Tracks](user-tracks.md) |
| Node promotion or demotion | [Registry](registry.md), governance state updated |

## Settings that affect Topology

* **Scan frequency** ([Settings → Cluster Infrastructure](settings.md#cluster-infrastructure)) controls how quickly newly observed flows and entities appear on the canvas.
* Which applications appear in the switcher depends on where the scanner is deployed via Helm.
