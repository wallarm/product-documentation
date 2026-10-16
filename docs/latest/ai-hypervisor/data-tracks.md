# Personal Data Flows <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Data Tracks** is no longer a separate page: the per-flow evidence of where personal data goes lives in [Traffic](user-tracks.md). For every flow between two entities, AI Hypervisor records the data classes touched, the personal-data patterns that matched, and the rule that produced the detection. That is the evidence layer behind data governance: *did a customer email leave for OpenAI yesterday* is answered by these records, not by a survey.

The same evidence appears in three places:

* **Traffic** → [Sensitive data](user-tracks.md#sensitive-data): every personal-data record, its risk score, and its journey over a time window. **Trace Flow on Graph** draws the record path on the map.
* **Traffic** → [Canary track](user-tracks.md#canary-track): planted canary tokens and every place they were seen.
* **Traffic** → **Flow**: the [boundary](traffic.md#boundary) of each application on the [Traffic Flow Map](traffic.md), with the personal data that crosses it.

## Data classes AI Hypervisor recognizes

* **PII classes:** email, SSN, payment card, health record, source code, secrets, plus user-defined patterns.
* **Data classifications:** PII, PCI, MNPI, GLBA, EU AI Act high-risk, public, internal, confidential, regulator-grade.

The classification taxonomy ships with sensible defaults and supports tenant-defined regex tags for custom data classes. Tenant-defined patterns are managed by your Wallarm representative.

## How detections are produced

Detections populate as traffic flows. No scheduled run, no batch job. Per flow, the platform records:

* **Source and destination entities**, both cross-linked to [Registry](registry.md).
* **PII classes and data classification** observed in the payload.
* **Volume:** request count and bytes over the time window.
* **Rule fired:** the exact rule that matched (for example, `\b\d{3}-\d{2}-\d{4}\b` in field `prompt`).
* **Time window:** first-seen, last-seen, sample count.

## Cross-references

| From the personal-data views in **Traffic** | You land in |
|---|---|
| Source or destination entity | [Registry](registry.md), entity detail |
| Initiating session | [Traffic](user-tracks.md#session-waterfall), session waterfall |
| A record path | [Traffic Flow Map](traffic.md), with the path highlighted |
| Recent alerts on the flow | [Notifications](notifications.md) |
| Evidence for compliance | [Compliance](compliance.md) |

You typically arrive here from the [Findings](findings.md) PII column, a [Registry](registry.md) entity, a [Topology](topology.md) edge, or a [Notifications](notifications.md) personal-data alert.

## Settings that affect personal-data detection

* **Scan frequency** ([Settings → Cluster Infrastructure](settings.md#cluster-infrastructure)) controls how often scanners poll, and therefore how fresh detections are.
* The applications and namespaces observed are determined by where the scanner is deployed via Helm and which workloads carry the `higgs.scan=enabled` label. See [Labels and Annotations](annotations.md).
