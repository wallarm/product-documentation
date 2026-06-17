# Compliance <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-executive.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

The **Compliance** page is the compliance evidence pack for your AI estate. It rolls everything AI Hypervisor observed during a chosen evidence period (control coverage, PII events, SBOM components and their CVEs, and the audit trail of platform activity) into a single report you can hand to an auditor, brief the board with, or upload to a GRC tool.

The data is the same as what you see scrolling [Briefing](briefing.md), [Data Tracks](data-tracks.md), and the rest. **Compliance** packages it for a fixed time window and signs the result, so an evidence pack is reproducible and exportable without manual data-stitching.

## Frameworks and control mapping

The current release frames the evidence pack against three frameworks:

* **SOC 2** (CC6 logical access, CC7 system operations)
* **EU AI Act** (Articles 9–15: risk management, data governance, transparency, logging, human oversight)
* **NIST AI RMF** (Govern, Map, Measure, Manage)

Each framework has its own control-coverage table, mapping every control to the platform signal that backs it:

| Framework | Control | Backing signal |
|---|---|---|
| EU AI Act | Article 9 (Risk management) | **Findings** risk scores, per-finding evidence |
| EU AI Act | Article 10 (Data governance) | PII flow records, data classification tags |
| EU AI Act | Article 12 (Logging) | Session audit logs |
| EU AI Act | Article 13 (Transparency) | Caller-class attribution per session |
| SOC 2 | CC6.1 (Logical access) | Identity attribution per session |
| SOC 2 | CC6.6 (Boundary protection) | PII flow records |
| SOC 2 | CC7.2 (System monitoring) | Session audit logs |
| NIST AI RMF | GOVERN-1.1 (AI risk identification) | **Findings** |
| NIST AI RMF | MAP-3.1 (AI system inventory) | **Registry** plus AI-SBOM |
| NIST AI RMF | MEASURE-2.4 (Monitoring) | Session audit logs, PII flow records |

Additional frameworks (ISO 42001, ISO 27001, GLBA, NYDFS 500, PCI DSS) are surfaced under the Compliance risk category in [Findings](findings.md). Full **Compliance** coverage for them is on the roadmap.

## What goes into a report

A report has four evidence types, each fed by a different platform signal. Each is also available independently through the platform API.

* **AI Software Bill of Materials (AI-SBOM).** Every package, model weight, MCP server binary, container image, and library running in your AI stack, with version, ecosystem, licence, CVE mapping, and a load-time-risk flag set for pickle and torch loads. Backed by [Supply Chain](supply-chain.md).
* **Coverage heatmap.** Per framework, every control labelled `Covered`, `Partial`, or `Gap` against observed evidence.
* **Session audit logs.** Every agent session preserved end to end: caller identity and class, application, full chronological waterfall (prompt → LLM call → tool call → response), step status, session status. Backed by [User Tracks](user-tracks.md).
* **PII flow records.** Every flow that carried PII: source entity, destination, PII classes, data classification, the rule that matched, volume, and time window. Backed by [Data Tracks](data-tracks.md).

The rendered PDF also carries an **executive-summary** card (four numbers: controls covered, PII events, SBOM components, risk score) and a **metadata** block (tenant, cluster, scanner version, data-source provenance).

## Evidence period, attestation, and export

When you generate a report, you choose its **evidence period**: the time window the report aggregates over. The range is bounded by tenant retention. Default retention is 90 days for session and PII data, indefinite for SBOM and previously generated reports. Longer retention is available on request: [contact Wallarm sales](mailto:sales@wallarm.com).

Each report carries an **attestation block** at the foot: generation signature, timestamp, and content hash. The hash binds the document to the exact dataset it was generated from, so any later edit is detectable. Auditors who care about chain-of-custody check this first.

The same content is also available via the **platform API**, scoped by tenant and evidence period. Teams running their own GRC tooling (ServiceNow GRC, OneTrust, Vanta, in-house) integrate against the API to flow evidence into the GRC pipeline without downloading PDFs.

## Cross-references

| Report element | Source surface |
|---|---|
| Control coverage | [Findings](findings.md), findings backing the control |
| PII detection summary | [Data Tracks](data-tracks.md), per-flow records |
| SBOM inventory | [Supply Chain](supply-chain.md), per-component inventory |
| Session audit row | [User Tracks](user-tracks.md), session waterfall |
| Audit-trail event | [Notifications](notifications.md), originating notification |

## Settings that affect Compliance

* **Frameworks covered** are controlled by the platform release; not configurable per tenant.
* **Evidence period** is bounded by your tenant's retention window (90 days default for session and PII data).
