# Hyper Graph <a href="overview.md#subscription"><img src="../../images/ai-hypervisor-tag.svg" style="border: none;"></a>

Hyper Graph is the **3D unified graph view** of every entity the platform observes — agents, MCP servers, LLM providers, data sources, APIs — and the traffic edges between them. It draws from the same data that powers [Topology](topology.md), [Registry](registry.md), and [Data Tracks](data-tracks.md), but the 3D arrangement surfaces relationships and clustering the row-shaped views miss.

## What it is good for

* **Spotting cluster anomalies** — entities of the same category cluster together; a node sitting alone or carrying too many cross-cluster edges is usually a misconfigured agent or an unexpected integration.
* **Tracing a single entity in context** — selecting a node and switching between *Direct*, *Downstream*, *Upstream*, or *Full trace* views shows only the subgraph that touches the entity, which is faster than scrolling rows in Registry.
* **Surfacing shadow AI visually** — entities observed only via external signals (DNS, cloud audit, ingress) appear next to your sanctioned inventory, so unannounced integrations are visible at a glance.

## Layouts and grouping

The graph supports several spatial arrangements: **Clusters** (default — by category), Layers, Data Spheres, Skyline Towers, Tetra Pyramid, and Free. Different layouts answer different questions; the underlying data is the same. Group-by and size-by selectors control which property drives clustering and which drives node size.

## What is recorded per entity

Selecting a node surfaces the same per-entity data as [Registry](registry.md): name, type, category, source, risk level, status, and dynamic metadata such as CVE mappings, PII types touched, layer, region, and data classification.

## Filtering

Two filter dimensions narrow what is rendered without losing the spatial context:

* **Flow types** — kinds of traffic edges (PII flows, control flows, others).
* **Entity types** — node categories (agents, MCP servers, LLMs, data sources, and others).

Counts on each filter chip show how much is in each bucket, so the filter doubles as a quick inventory readout.

## Cross-references

| From Hyper Graph | You land in |
|---|---|
| Node detail → recent sessions | [User Tracks](user-tracks.md) |
| Node detail → PII flows | [Data Tracks](data-tracks.md) filtered to the entity |
| Promote / demote a node | Updates governance state in [Registry](registry.md) |

## Settings that affect Hyper Graph

* **Scan frequency** (Settings → Cluster Infrastructure) — how quickly newly-observed entities and edges appear on the graph.
