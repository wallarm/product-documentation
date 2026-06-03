# Notifications <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

Notifications is the **inbox** of significant things the platform has detected — new applications brought under coverage, CVEs found or resolved in a scanned app, PII observed in agent traffic, scanner-health changes. Most entries are informational; some deep-link into a follow-up view ([User Tracks](user-tracks.md), [Supply Chain](supply-chain.md)) when there is something to act on.

Reviewing it regularly is the difference between learning about a critical finding today and hearing about it from someone outside security next week.

## Notification categories

* **Apps** — application-level events: a new application went under coverage, scanner-health change, and so on.
* **CVE** — new vulnerabilities found, or CVEs resolved.
* **PII** — sensitive data detected in agent traffic.
* **Scanner offline** — coverage gap on one or more applications, with a troubleshooting hint.

Each notification carries the affected application, a severity, and the detail body — for example, a PII event lists the detected PII classes and links to the sessions where they appeared; a new-CVE event lists each vulnerability with its GHSA or PYSEC identifier and links into the affected app's supply-chain analysis.

## Cross-references

| Notification type | Where it takes you |
|---|---|
| PII event | [User Tracks](user-tracks.md) — sessions where the PII was observed |
| New CVE | [Supply Chain](supply-chain.md) — affected app's risk-analysis view |
| New app discovered | [Registry](registry.md) — the newly inventoried application |
| Scanner offline | [Settings → Cluster Infrastructure](settings.md) — scanner pod health |

## Settings that affect Notifications

The **Send notifications for** preferences in [Settings](settings.md) control which categories increment the unread-badge counter:

* **CVEs** (default on)
* **Scan offline** (default on)
* **PII** (default off)

Disabling a category does not hide its notifications from the feed — entries still appear in the muted "read" state, they just stop incrementing the badge. There is no per-rule configuration, no severity-threshold tuning, and no outbound-channel routing in the current release.
