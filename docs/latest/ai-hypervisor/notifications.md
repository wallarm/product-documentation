# Notifications <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-executive.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Notifications** is the inbox of significant things AI Hypervisor has detected: new applications brought under coverage, CVEs found or resolved in a scanned app, PII observed in agent traffic, scanner-health changes. Most entries are informational. Some deep-link into a follow-up view ([User Tracks](user-tracks.md), [Supply Chain](supply-chain.md)) when there is something to act on.

Reviewing the feed regularly is the difference between learning about a critical finding today and hearing about it from someone outside security next week.

## Notification categories

The feed's tab strip groups events by category:

* **All.** The combined stream.
* **Apps.** Application-level events: a new application came under coverage, a workload changed governance state, scanner health for an app changed.
* **CVE.** New vulnerabilities found in scanned components, or CVEs resolved by an upgrade.
* **PII.** Sensitive data detected in agent traffic.

Scanner-health events (`scanner_offline`, pulse gaps) appear in the **All** stream and inside the **Apps** category — they are not a separate tab. See [Settings](settings.md) for the toggle that controls whether scanner-offline events increment the unread-badge counter.

Each notification carries the affected application, a severity, and the detail body. A PII event lists the detected PII classes and links to the sessions where they appeared. A new-CVE event lists each vulnerability with its GHSA or PYSEC identifier and links into the affected app's supply-chain analysis.

## Cross-references

| Notification type | Where it takes you |
|---|---|
| PII event | [User Tracks](user-tracks.md), sessions where the PII was observed |
| New CVE | [Supply Chain](supply-chain.md), affected app's risk-analysis view |
| New app discovered | [Registry](registry.md), the newly inventoried application |
| Scanner offline | [Settings → Cluster Infrastructure](settings.md#cluster-infrastructure), scanner pod health |

## Settings that affect Notifications

The **Send notifications for** preferences in [Settings](settings.md) control which categories increment the unread-badge counter:

* **CVEs** (default on)
* **Scan offline** (default on)
* **PII** (default off)

Disabling a category does not hide notifications from the feed. Entries still appear in the muted "read" state and stop incrementing the badge. There is no per-rule configuration, no severity-threshold tuning, and no outbound-channel routing in the current release.
