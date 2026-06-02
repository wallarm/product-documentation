# Reports <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

The **Reports** page is the **compliance evidence pack** for your AI estate. It rolls everything the platform observed during a chosen evidence period — control coverage, PII events, SBOM components and their CVEs, and the audit trail of platform activity — into a single document you can hand to an auditor, brief the board with, or upload to a GRC tool.

Compared to scrolling [Heatmap](heatmap.md), [Data Tracks](data-tracks.md), and other surfaces individually, **Reports** packages all of it for a fixed time window and signs the result — so an evidence pack is reproducible and exportable without manual data-stitching.

## Frameworks and control mapping

The current release frames the evidence pack against **SOC 2** (CC6 logical access, CC7 system operations), **EU AI Act** (Articles 9–15: risk management, data governance, transparency, logging, human oversight), and **NIST AI RMF** (Govern, Map, Measure, Manage). Each framework has its own control-coverage table, with every control mapped to the platform signal that backs it.

| Framework | Control | Backing signal |
|---|---|---|
| EU AI Act | Article 9 (Risk management) | Heatmap risk scores, per-finding evidence |
| EU AI Act | Article 10 (Data governance) | PII flow records, data classification tags |
| EU AI Act | Article 12 (Logging) | Session audit logs |
| EU AI Act | Article 13 (Transparency) | Caller class attribution per session |
| SOC 2 | CC6.1 (Logical access) | Identity attribution per session |
| SOC 2 | CC6.6 (Boundary protection) | PII flow records |
| SOC 2 | CC7.2 (System monitoring) | Session audit logs |
| NIST AI RMF | GOVERN-1.1 (AI risk identification) | Findings on Heatmap |
| NIST AI RMF | MAP-3.1 (AI system inventory) | Registry plus AI-SBOM |
| NIST AI RMF | MEASURE-2.4 (Monitoring) | Session audit logs, PII flow records |

Additional frameworks (ISO 42001, ISO 27001, GLBA, NYDFS 500, PCI DSS) are surfaced under the Compliance risk category on [Heatmap](heatmap.md); full **Reports** coverage for these is on the roadmap.

## What goes into a report

A report has four evidence types, each fed by a different platform signal. Each is also available independently through the platform API.

* **AI Software Bill of Materials (AI-SBOM)** — every package, model weight, MCP server binary, container image, and library running in your AI stack, with version, ecosystem, license, CVE mapping, and load-time-risk flag (set for pickle / torch loads). Backed by [Supply Chain](supply-chain.md).
* **Coverage heatmap** — per framework, every control labelled `Covered` / `Partial` / `Gap` against observed evidence.
* **Session audit logs** — every agent session preserved end to end: caller identity and class, application, full chronological waterfall (prompt → LLM call → tool call → response), step status, session status. Backed by [User Tracks](user-tracks.md).
* **PII flow records** — every flow that carried PII: source entity, destination, PII classes, data classification, the rule that matched, volume, and time window. Backed by [Data Tracks](data-tracks.md).

The rendered PDF also carries an **executive-summary** card (four numbers: controls covered, PII events, SBOM components, risk score) and a **metadata** block (tenant, cluster, scanner version, data-source provenance).

## Evidence period, attestation, and export

When you generate a report, you choose its **evidence period** — the time window the report aggregates over. The range is bounded by tenant retention: by default 90 days for session and PII data, indefinite for SBOM and previously generated reports. Longer retention is available on request — contact your Wallarm representative.

Each report carries an **attestation block** at the foot: generation signature, timestamp, and content hash. The hash binds the document to the exact dataset it was generated from, so a later edit is detectable; auditors who care about chain-of-custody check this first.

The same content is available via the **platform API**, scoped by tenant and evidence period — used by teams running their own GRC tooling (ServiceNow GRC, OneTrust, Vanta, in-house) to flow evidence into the GRC pipeline without downloading PDFs.

## Cross-references

| Report element | Source surface |
|---|---|
| Control coverage | [Heatmap](heatmap.md) — findings backing the control |
| PII detection summary | [Data Tracks](data-tracks.md) — per-flow records |
| SBOM inventory | [Supply Chain](supply-chain.md) — per-component inventory |
| Session audit row | [User Tracks](user-tracks.md) — session waterfall |
| Audit-trail event | [Notifications](notifications.md) — originating notification |

## Settings that affect Reports

* **Frameworks covered** are controlled by the platform release; not configurable per tenant.
* **Evidence period** is bounded by your tenant's retention window (90 days default for session and PII data).
