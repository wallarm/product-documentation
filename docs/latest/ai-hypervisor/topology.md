# Topology <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

Topology is the **traffic-flow map** of your environment — how requests move between agents, MCP servers, LLM providers, data sources, and APIs. It shows the same entities as [Hyper Graph](hyper-graph.md) and [Registry](registry.md) but emphasises the *connections* between them.

A node is one entity the scanner observed; an edge is a flow between two entities. Severities on each node aggregate the findings on that entity; severities on each edge surface PII, unsanctioned destinations, and other per-flow concerns.

## Layers and zones

Nodes are placed on a two-dimensional grid that matches the [Heatmap](heatmap.md) Full-stack lens:

* **Layers** (the functional role) — Interface, Identity, Orchestration, Guardrails, Inference, Protocol (MCP), Connectivity, Knowledge, Infrastructure.
* **Zones** (the infrastructure boundary) — Core platform, Cloud services, App platform, External.

Reading the canvas top-to-bottom shows how a request descends from the public entry point through identity, orchestration, and inference toward data; reading left-to-right shows what stays inside your platform versus what reaches out to third-party services.

A complementary **Flow** view renders the same nodes and edges as a directional tree, emphasising the path traffic takes rather than the architectural layout.

## Pipelines

A **pipeline** is a user-defined label that groups several agentic flows into one named business-process view (for example, "checkout-bot RAG flow"). Once a pipeline is defined, it appears as its own node on the canvas and rolls up totals — requests-per-minute, daily cost estimate, PII-carrying flow count — in the Pipeline overview block.

Pipelines are optional. Topology is fully usable without them, with the canvas showing raw per-entity nodes and edges.

## Governance filter and baselining

Topology respects the same three governance states as [Registry](registry.md): **Sanctioned**, **Tolerated**, **Unsanctioned**. A per-app governance filter lets you show or hide nodes by state. The **Baseline inventory** action bulk-promotes every Tolerated agent and MCP server in the current application to Sanctioned — useful right after deploying the scanner to a new application, when reviewing the discovered inventory is faster than promoting each row individually in Registry.

## Cross-references

| From Topology | You land in |
|---|---|
| Edge click | [Data Tracks](data-tracks.md), flow detail for that edge |
| Node detail → recent sessions | [User Tracks](user-tracks.md) |
| Node promotion / demotion | Updates governance state in [Registry](registry.md) |

## Settings that affect Topology

* **Scan frequency** (Settings → Cluster Infrastructure) — controls how quickly newly-observed flows and entities appear on the canvas.
* Which applications appear in the switcher is decided by where the scanner has been deployed via Helm.
