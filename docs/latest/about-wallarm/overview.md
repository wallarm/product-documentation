# Wallarm AI Control Platform Overview

Wallarm provides AI Control Platform — an AI and API security platform that discovers your APIs and AI workloads, protects them against attacks and abuse, tests them for vulnerabilities, and produces continuous governance evidence.

Enterprises are deploying AI faster than they can govern it. AI agents act, decide, and call APIs autonomously, with less oversight than the people they replace. At the same time, APIs — internal services, partner-facing endpoints, third-party integrations, and the ones AI workloads consume — have become the primary attack surface, exposed to both classic abuse and AI-specific exploitation. Wallarm AI Control Platform addresses both problems in one place.

## Platform products

Wallarm AI Control Platform comprises four products:

* **[Wallarm API Security](api-security-overview.md)** — protection for your APIs: internal services, partner-facing endpoints, third-party integrations, and the APIs consumed by AI workloads. Blocks the OWASP API Top 10, automated abuse, account takeover, AI-targeted attacks, and attacks against Model Context Protocol (MCP) servers across REST, GraphQL, gRPC, SOAP, and WebSocket. Deploys wherever your traffic lives — cloud, hybrid, or edge.
* **[Wallarm AI Hypervisor](../ai-hypervisor/overview.md)** — runtime observability, enforcement, and governance for AI workloads. Observes every AI agent decision, enforces policy at the connection level, and produces continuous compliance evidence — without modifying the application. **Available on AWS only**.
* **[Wallarm Infrastructure Discovery](../infrastructure-discovery/overview.md)** — cross-account visibility across your cloud estate. Maps every workload, surfaces shadow AI within minutes of deployment, and makes findings from native cloud security services actionable. **Available on AWS only**.
* **[Wallarm API Security Testing](../vulnerability-detection/security-testing-overview.md)** — proactively uncovers security issues in your applications and APIs before attackers exploit them, through dynamic testing, threat replay, and external attack surface management.

## The Wallarm AI Control Loop

AI and API security in production is not one job. It is four jobs that must work together. Wallarm AI Control Platform delivers all four as the **Wallarm AI Control Loop** — a continuous cycle where each stage feeds the next.

### Discover

See every AI workload, every API, every cloud asset — including the ones nobody inventoried.

* **APIs** ([Wallarm API Security](api-security-overview.md)): detects API endpoints and parameters from live traffic, identifies [rogue endpoints](../api-discovery/rogue-api.md) including shadow and zombie APIs, spots endpoints that expose sensitive data, and [assigns each endpoint a risk score](../api-discovery/risk-score.md).
* **AI workloads on AWS** ([Wallarm AI Hypervisor](../ai-hypervisor/overview.md)): auto-discovers MCP servers, agent frameworks, data sources, and model provider calls from runtime behavior on Amazon EKS. Shadow AI surfaces from what is actually running, not from what was declared in a manifest.
* **AWS estate** ([Wallarm Infrastructure Discovery](../infrastructure-discovery/overview.md)): cross-account discovery of compute, network, API Gateway, Lambda, and IAM resources, with creator attribution on every asset and a live relationship graph that shows how systems connect.
* **External attack surface** ([Wallarm API Security Testing](../vulnerability-detection/security-testing-overview.md)): discovers external hosts and APIs without deployment via [API Attack Surface Management (AASM)](../api-attack-surface/overview.md).

### Observe

Watch what AI and APIs actually do at runtime - every call, every data flow, every decision.

* **API traffic** ([Wallarm API Security](api-security-overview.md)): analyzes every request and response, identifying attacks against [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP API Top 10](https://owasp.org/www-project-api-security/), [API-specific bot abuse](../api-abuse-prevention/overview.md), [credential stuffing attempts](../about-wallarm/credential-stuffing.md), and behavioral anomalies.
* **AI agent behavior on AWS** ([Wallarm AI Hypervisor](../ai-hypervisor/overview.md)): captures every outbound connection an AI workload makes on EKS — LLM calls, internal APIs, databases, third-party services — and attributes each call back to the user or session that triggered it, across service hops.
* **AWS findings on one graph** ([Wallarm Infrastructure Discovery](../infrastructure-discovery/overview.md)): findings from native AWS security services land on the asset they affect, with full asset context, so analysts can see them in relation to everything else running.

### Enforce

Stop policy violations and malicious actors automatically. Block, quarantine, revoke.

* **API protection** ([Wallarm API Security](api-security-overview.md)): detects attacks both [inline](../installation/inline/overview.md) and [out-of-band](../installation/oob/overview.md). Counters Layer 7 DoS with [rate limiting](../user-guides/rules/rate-limiting.md). Lets you define [custom defenses](../user-guides/rules/regex-rule.md) alongside built-in measures. Geolocation-based controls, [virtual patches](../user-guides/rules/vpatch-rule.md), and [filtration mode controls](../admin-en/configure-wallarm-mode.md#available-filtration-modes) keep malicious activity off your APIs.
* **AI runtime enforcement on AWS** ([Wallarm AI Hypervisor](../ai-hypervisor/overview.md)): blocks outbound LLM calls on pattern-match rules and revokes compromised AI agent sessions by user identity or trace ID. Active connections terminate at the kernel — no pod restart, no deploy cycle.

### Govern

Generate evidence — do not assemble it. Continuous coverage records, audit logs, AI inventories, and regulatory mappings. Audit-ready at any time, with live data.

* **AI governance evidence on AWS** ([Wallarm AI Hypervisor](../ai-hypervisor/overview.md)): continuous coverage heatmap, AI software bill of materials (AI-SBOM), session audit logs, and sensitive data flow records. Maps to EU AI Act, SOC 2, and sector audit requirements at any time.
* **AWS asset and finding audit trail** ([Wallarm Infrastructure Discovery](../infrastructure-discovery/overview.md)): every triage decision logged, every asset attributed to the user who created it, drift detection on every scan.
* **Vulnerability evidence** ([Wallarm API Security Testing](../vulnerability-detection/security-testing-overview.md)): all found security issues, regardless of detection method, are consolidated in the [**Security Issues**](../user-guides/vulnerabilities.md) section of Wallarm Console.
* **Operational response** ([Wallarm API Security](api-security-overview.md)): [deep attack inspection](../user-guides/events/check-attack.md), broad [integrations](../user-guides/settings/integrations/integrations-intro.md) with SIEM, SOAR, ticketing, and chat tools (Slack, Sumo Logic, Splunk, Microsoft Sentinel, and more) route findings into the workflows security teams already operate.
