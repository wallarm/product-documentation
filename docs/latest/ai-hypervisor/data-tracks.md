# Data Tracks <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

Data Tracks is the **per-flow evidence view**. For every data flow between two entities, it records which data classes were touched, which PII patterns matched, and which rule produced the detection. It is the evidence layer behind data governance — *"did a customer's email leave for OpenAI yesterday"* is a Data Tracks query, not a survey.

Every flow carries its full lineage: which agent initiated it, which destination it reached, which PII classes were observed, which rule fired, and how many requests and bytes that flow has carried over a given time window.

## Data classes the platform recognises

* **PII classes** — email, SSN, payment card, health record, source code, secrets, plus user-defined patterns
* **Data classifications** — PII, PCI, MNPI, GLBA, EU AI Act high-risk, public, internal, confidential, regulator-grade

The classification taxonomy ships with sensible defaults and supports tenant-defined regex tags for custom data classes. Tenant-defined patterns are managed by your Wallarm representative.

## How detections are produced

Detections populate continuously as traffic flows — there is no scheduled run, no batch job. Per flow the platform records:

* **Source and destination entities** — both cross-linked to [Registry](registry.md).
* **PII classes and data classification** observed in the payload.
* **Volume** — request count and bytes over the time window.
* **Rule fired** — the exact rule that matched (for example, "pattern `\b\d{3}-\d{2}-\d{4}\b` in field `prompt`").
* **Time window** — first-seen, last-seen, sample count.

## Cross-references

| From Data Tracks | You land in |
|---|---|
| Source or destination entity | [Registry](registry.md), entity detail |
| Initiating session | [User Tracks](user-tracks.md), session waterfall |
| Recent alerts on this flow | [Notifications](notifications.md), filtered |
| Evidence for compliance | [Reports](reports.md), entity- or flow-scoped bundle |
| View in Topology | [Topology](topology.md), focused on the flow's two endpoints |

You typically arrive at Data Tracks from [Heatmap](heatmap.md) Top-3 PII exposures, a [Registry](registry.md) entity's PII-flows view, a [Topology](topology.md) edge, or a [Notifications](notifications.md) PII alert.

## Settings that affect Data Tracks

* **Scan frequency** ([Settings → Cluster Infrastructure](settings.md#cluster-infrastructure)) — how often scanners poll, which decides how fresh detections are.
* The applications and namespaces observed are decided by where the scanner has been deployed via Helm and which workloads carry the `higgs.scan=enabled` label — see [Labels and Annotations](annotations.md).
