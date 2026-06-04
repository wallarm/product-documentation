# Supply Chain <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Supply Chain** is the inventory of third-party code your AI stack depends on: the packages, model weights, MCP server binaries, container images, and libraries running inside your instrumented workloads, with their vulnerabilities, licence posture, and load-time risk. It is the per-asset version of the AI-SBOM that [Compliance](compliance.md) folds into the evidence pack.

The scanner builds the inventory continuously from in-process introspection and on-disk scanning. You do not declare components yourself. New CVEs published against components you already run surface in [Notifications](notifications.md) within one scan cycle of the CVE database update.

## What is tracked per component

For every component AI Hypervisor discovers, **Supply Chain** records:

* **Name** and **version**.
* **Ecosystem:** PyPI, npm, Maven, Go modules, container image, model registry, MCP binary.
* **Detected use:** which workloads (and which application) import or load this component.
* **CVE mapping:** every CVE that affects this exact version, with CVSS severity and the GHSA or PYSEC identifier.
* **Licence** when detectable in package metadata.
* **Load-time risk** flagged when the component is loaded via a deserialisable format (pickle, torch) where arbitrary-code execution at load time is possible.

## Why it matters

* **CVE response.** *Which of our agents is running a vulnerable version of `pyyaml`?* **Supply Chain** answers it as one query, with no shell-out to a separate package scanner.
* **Unsafe-pickle detection.** Model weights distributed as pickle or torch files are a published agentic-AI attack surface. **Supply Chain** marks them so a security review of an open-source model has a starting point.
* **Licence audit.** Pulling the licence column for an evidence period proves which open-source licences your AI stack touches.
* **Pre-deploy review.** When a team adds a new dependency, the inventory updates on the next scan. No SBOM regeneration step in your CI is needed.

## Cross-references

| From **Supply Chain** | You land in |
|---|---|
| Workload using a component | [Registry](registry.md), the workload's component list |
| CVE alert for a component | [Notifications](notifications.md), the CVE notification |
| Supply-domain row in Findings | [Findings](findings.md), aggregated supply-chain risk for the application |
| SBOM inventory section of a report | [Compliance](compliance.md), the same data packaged for audit |

## Settings that affect Supply Chain

* **Scan frequency** ([Settings → Cluster Infrastructure](settings.md#cluster-infrastructure)) controls how often the scanner re-enumerates components, and therefore how fresh the inventory and CVE matches are.
* Which applications appear in **Supply Chain** depends on where the scanner is deployed via Helm and which workloads carry the `higgs.scan=enabled` label. See [Labels and Annotations](annotations.md).
