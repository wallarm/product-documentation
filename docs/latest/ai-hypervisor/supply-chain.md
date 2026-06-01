# Supply Chain <a href="overview.md#subscription"><img src="../../images/ai-hypervisor-tag.svg" style="border: none;"></a>

Supply Chain is the **inventory of third-party code your AI stack depends on** — the packages, model weights, MCP server binaries, container images, and libraries running inside your instrumented workloads, with the vulnerabilities, license posture, and load-time risk for each. It is the per-asset version of the AI-SBOM that [Reports](reports.md) folds into the compliance evidence pack.

The scanner builds the inventory continuously from in-process introspection and on-disk scanning; you do not declare components yourself. New CVEs published against components you already run surface in [Notifications](notifications.md) within one scan cycle of the CVE database update.

## What is tracked per component

For every component the platform discovers, Supply Chain records:

* **Name** and **version**
* **Ecosystem** — PyPI, npm, Maven, Go modules, container image, model registry, MCP binary
* **Detected use** — which workloads (and which application) import or load this component
* **CVE mapping** — every CVE that affects this exact version, with CVSS severity and the GHSA / PYSEC identifier
* **License** (when detectable in package metadata)
* **Load-time risk** — flagged when the component is loaded via a deserializable format (pickle, torch) where arbitrary-code execution at load time is possible

## Why it matters

* **CVE response.** "*Which of our agents is running a vulnerable version of `pyyaml`?*" Supply Chain answers it as one query — no shell-out to a separate package scanner.
* **Unsafe-pickle detection.** Model weights distributed as pickle / torch files are a published agentic-AI attack surface; Supply Chain marks them so a security review of an open-source model has a starting point.
* **License audit.** Pulling the license column for an evidence period proves which open-source licenses your AI stack touches.
* **Pre-deploy review.** When a team adds a new dependency, the inventory updates on the next scan — no SBOM regeneration step in your CI is needed.

## Cross-references

| From Supply Chain | You land in |
|---|---|
| Workload using a component | [Registry](registry.md) — the workload's component list |
| CVE alert for a component | [Notifications](notifications.md) — the CVE notification |
| Supply-domain row on Heatmap | [Heatmap](heatmap.md) — aggregated supply-chain risk for the application |
| SBOM inventory section of a report | [Reports](reports.md) — same data packaged for audit |

## Settings that affect Supply Chain

* **Scan frequency** ([Settings → Cluster Infrastructure](settings.md#cluster-infrastructure)) — how often the scanner re-enumerates components, which decides how fresh the inventory and CVE matches are.
* Which applications appear in Supply Chain is decided by where the scanner has been deployed via Helm and which workloads carry the `higgs.scan=enabled` label — see [Labels and Annotations](annotations.md).
