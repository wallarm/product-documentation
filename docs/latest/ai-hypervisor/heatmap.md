# Heatmap <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

Heatmap is the single-screen overview of your AI estate. It answers four questions at a glance: *what AI do we run, how healthy is it, what is on fire right now, are we trending in the right direction.*

The same data is available through two lenses, each grouping observed findings differently:

* **Risk matrix** — findings grouped by **asset domain** (Agents, API, Data, LLM, MCP, Runtime, Supply) × **risk category**. The default lens, geared to *"which kind of entity has the most open risk."*
* **Full stack** — the same findings grouped by **stack layer** (Interface, Identity, Orchestration, Cognitive firewall, Inference, Protocol, Connectivity, Knowledge, Infrastructure) × **security control**. Geared to *"which architectural layer of my stack has the most open risk."*

A per-application **Security Score** (0–100, where 100 = no risk) and per-row scores summarise the same findings as a single number; the matrix cell count and the Security Score are two views of the same underlying findings, running in opposite directions (more findings → higher cell count, lower score).

## What a finding is

A **finding** is a discrete record of something worth attention the platform has detected. Every finding carries a **risk category** (Access, Authentication, Compliance, CVE, Injection, PII, Shadow) and the **asset** it applies to. One CVE on one dependency is one finding; one PII leak in one session is one finding; one unsanctioned shadow vendor talking to one agent is one finding. Everything on Heatmap — every cell number, every tile, the overall score — is an aggregation of these finding records.

## Caller mix

Heatmap surfaces a per-application **caller mix** above the matrix — how each application's recent traffic breaks down by *who is calling*. The seven caller classes are:

* **Human (browser)** — interactive sessions from a real user in a web browser
* **Human (CLI)** — operators using shell scripts, `curl`, internal tooling
* **AI agent (known)** — agents whose fingerprint the platform recognizes
* **AI agent (suspected)** — traffic shaped like agent activity but without a confirmed fingerprint
* **Service internal** — service-to-service calls inside your environment
* **Infra probe** — health checks, monitors, Kubernetes liveness probes
* **Unknown** — caller class cannot be classified yet

A new app suddenly serving heavy *AI agent (suspected)* traffic is a signal worth investigating — either you have a real agent integration nobody told you about, or someone is fingerprint-evading. The same caller-class palette carries over to [User Tracks](user-tracks.md).

## Risk categories

The same seven **risk categories** form the columns of Heatmap in both lenses. Same concerns, same definitions, just plotted against a different vertical axis.

### Access

*Who is allowed to invoke which agents, tools, or data sources.* A high access risk usually means an entity is reachable by callers outside its intended audience, or that role-scoped restrictions are not in force. Investigate the affected entity in [Registry](registry.md); resolution happens in the entity's own configuration (its IdP, gateway, or service definition) — the platform surfaces the risk, it does not enforce the rule.

### Authentication

*Identity verification, token validity, session integrity.* A high auth risk indicates missing or weak credentials on a component: anonymous calls accepted, tokens that never rotate, identity implied rather than asserted. Trace the failing flows in [User Tracks](user-tracks.md).

### Compliance

Compliance posture against the frameworks your organization is audited under (SOC 2, ISO 27001, ISO 42001, NIST AI RMF, EU AI Act, GLBA, NYDFS 500). A high compliance risk means at least one control in the framework lacks runtime evidence. Export the gap from [Reports](reports.md).

### CVE

Known vulnerabilities (Common Vulnerabilities and Exposures) detected in the components that make up your AI stack — packages, model weights, MCP server binaries. A high CVE risk surfaces components that need patching or replacement; drill into the entity's [Registry](registry.md) detail for the affected versions and remediation steps.

### Injection

Prompt injection — *adversarial inputs designed to subvert an AI agent's instructions*. A high injection risk means inputs reaching an agent without canary-token or pattern detection in place.

### PII

*What sensitive data each entity has touched and where it has flowed.* A high PII risk indicates sensitive data flowing to a destination outside the sanctioned set. Verify per-flow in [Data Tracks](data-tracks.md).

### Shadow

Shadow AI — *AI components observed in external signals (DNS queries to AI provider domains, cloud audit logs, ingress traffic matching AI API patterns) but absent from the scanner's inventory*. The platform tracks three governance states across the same data: **sanctioned** (in the approved baseline), **tolerated** (in inventory but not approved), and **unsanctioned / shadow** (only seen in external logs). The Shadow column counts that third group — the AI vendors a team started using without telling anyone. Spot them in [Hyper Graph](hyper-graph.md), then promote or block from [Registry](registry.md).

## Asset domains

The **Risk matrix** lens groups findings by **asset domain** — the class of entity the platform observed. A high severity in a domain means the underlying entities of that class need attention.

### Agents

The AI agents your teams run — anything that takes a goal, decides what to do, and calls tools or APIs to get it done. Includes both off-the-shelf agent frameworks and your own bespoke orchestrators. Risks here usually mean an agent is exposed without authorization, is mishandling PII, or is calling tools outside its sanctioned scope.

### API

Service endpoints your agents and applications expose or consume. Any callable surface reachable over the network — internal services and external APIs alike — regardless of protocol or style (REST, gRPC, GraphQL, WebSocket, webhooks). For governance, the protocol is incidental; what matters is which callers can reach the endpoint, what data passes through, and whether that flow is sanctioned.

### Data

Data sources your agents read from and write to — **databases** (relational, document, key-value) and **vector stores**. Detected via in-process client libraries and via observed network connections to standard database ports. Risks here surface PII flowing through agent sessions, missing encryption on the data source itself, and PII egress to third-party AI providers.

### LLM

The language models in use — externally-hosted commercial models, cloud-provider-hosted models, and locally-served open-weight models — plus the inference traffic that flows to them. Risks include unsanctioned providers, missing prompt-injection defense, and PII reaching external endpoints.

### MCP

MCP (Model Context Protocol) servers and the tools they expose. Each MCP server is a structured connector that your agents can call. Risks include over-permissive tool catalogs, unapproved servers, and dangerous tool combinations.

### Runtime

Container, sandbox, and process-level concerns — the environment your agents and connectors run in. Risks include over-privileged containers, lateral access, missing sandboxing, and unmanaged shell access from agent code.

### Supply

Supply-chain — the third-party code your AI stack depends on: packages (with their version, ecosystem, license, and CVEs), the libraries they pull in, and AI models loaded via deserializable formats (pickle / torch) where arbitrary-code execution at load time is a risk. Findings here surface CVE-affected package versions and unsafe-pickle model loading.

## Stack layers (Full stack lens)

The **Full stack** lens groups the same findings by **stack layer** instead of asset domain. Each layer is a vertical slice of the platform that owns a specific kind of risk.

* **Interface** — the public front door: REST / GraphQL / WebSocket entry points, WAF, rate limiting, DDoS protection, schema validation.
* **Identity** — authentication and Non-Human Identity (NHI). On-Behalf-Of tokens, service-to-service trust, agent identity assertions.
* **Orchestration** — the "agent manager" — sequences tool calls, routes intermediate results, prevents infinite loops, enforces human-in-the-loop approvals.
* **Cognitive firewall** — the guardrail layer in front of the model: prompt-injection blocking, PII redaction, jailbreak detection.
* **Inference** — the model itself, commercial or self-hosted. Data-privacy concerns (zero retention, residency), model switching, fallback.
* **Protocol** — MCP servers and tools, tool inventory, parameter visibility, shadow-tool detection.
* **Connectivity** — external APIs and SaaS the agents reach, plus any gateway / integration middleware in front of them.
* **Knowledge** — the memory: internal databases, vector stores, S3. Row-level security, RAG poisoning defense, sensitive-document handling.
* **Infrastructure** — the container and the code. Supply-chain scanning, runtime sandboxing, preventing shell access from agent code.

## Cross-references

| Heatmap signal | Where to act |
|---|---|
| High Access or Authentication finding on an entity | [Registry](registry.md) — open the entity's detail |
| High PII finding | [Data Tracks](data-tracks.md) — per-flow PII records |
| High Compliance finding | [Reports](reports.md) — framework-specific evidence pack |
| Shadow column lit up | [Hyper Graph](hyper-graph.md) → promote / block in [Registry](registry.md) |
| Injection finding on an agent | [User Tracks](user-tracks.md) — trace the affected sessions |

## Settings that affect Heatmap

* **Scan frequency** (Settings → Cluster Infrastructure) — how often scanners poll, which determines how fresh the cell counts are.
* Which applications appear in the switcher is decided by where the scanner has been deployed via Helm — it is not configured from the UI.
