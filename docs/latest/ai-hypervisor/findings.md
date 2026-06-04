# Findings and risk model <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

This page is the product-level reference for the taxonomy AI Hypervisor uses across every UI surface: what a finding is, the risk categories findings carry, the asset domains they apply to, and the stack-layer model. The same vocabulary shows up in [Briefing](briefing.md) tiles, [Registry](registry.md) entity detail, [Patterns](patterns.md), [Compliance](compliance.md) control mapping, and audit reports.

## What a finding is

A **finding** is a discrete record of something worth attention. Every finding carries:

* A **risk category** (one of the seven below) naming what kind of risk it is.
* An **asset** it applies to: an agent, MCP server, LLM endpoint, data source, or other entity.
* A **severity** (`critical`, `high`, `medium`, `low`) derived from CVSS, the data class touched, or detector-specific rules.

One CVE on one dependency is one finding. One PII leak in one session is one finding. One unsanctioned shadow vendor talking to one agent is one finding. Every count, tile, and score in the product is an aggregation of these records.

## Risk categories

Each finding falls into exactly one of seven risk categories. Same concerns, same definitions, wherever findings appear.

### Access

*Who is allowed to invoke which agents, tools, or data sources.* A high access risk usually means an entity is reachable by callers outside its intended audience, or that role-scoped restrictions are not in force. Open the affected entity in [Registry](registry.md); resolution happens in the entity's own configuration (its IdP, gateway, or service definition). AI Hypervisor surfaces the risk; it does not enforce the rule.

### Authentication

*Identity verification, token validity, session integrity.* A high auth risk indicates missing or weak credentials on a component: anonymous calls accepted, tokens that never rotate, identity implied rather than asserted. Trace the failing flows in [User Tracks](user-tracks.md).

### Compliance

Compliance posture against the frameworks your organisation is audited under: SOC 2, ISO 27001, ISO 42001, NIST AI RMF, EU AI Act, GLBA, NYDFS 500. A high compliance risk means at least one control in the framework lacks runtime evidence. Export the gap from [Compliance](compliance.md).

### CVE

Known vulnerabilities (Common Vulnerabilities and Exposures) detected in the components that make up your AI stack: packages, model weights, MCP server binaries. A high CVE risk surfaces components that need patching or replacement. Open the entity in [Registry](registry.md) for affected versions and remediation steps.

### Injection

Prompt injection: *adversarial inputs designed to subvert an AI agent's instructions*. A high injection risk means inputs reach an agent without canary-token or pattern detection in place.

### PII

*Which sensitive data each entity has touched and where it has flowed.* A high PII risk indicates sensitive data flowing to a destination outside the sanctioned set. Verify per flow in [Data Tracks](data-tracks.md).

### Shadow

Shadow AI: AI components observed in external signals (DNS queries to AI provider domains, cloud audit logs, ingress traffic matching AI API patterns) but absent from the scanner's inventory. The product tracks three governance states across the same data: **sanctioned** (in the approved baseline), **tolerated** (in inventory but not approved), and **unsanctioned / shadow** (only seen in external logs). See [Shadow AI](shadow-ai.md) for the dedicated surface.

## Asset domains

Findings group by **asset domain**: the class of entity AI Hypervisor observed. A high severity in a domain means the entities in that class need attention.

### Agents

The AI agents your teams run. Anything that takes a goal, decides what to do, and calls tools or APIs to get it done. This includes off-the-shelf agent frameworks and your own bespoke orchestrators. Risks here usually mean an agent is exposed without authorisation, is mishandling PII, or is calling tools outside its sanctioned scope.

### API

Service endpoints your agents and applications expose or consume. Any callable surface reachable over the network, internal or external, in any protocol (REST, gRPC, GraphQL, WebSocket, webhooks). For governance, the protocol is incidental. What matters is who can reach the endpoint, what data passes through, and whether the flow is sanctioned.

### Data

Data sources your agents read from and write to: **databases** (relational, document, key-value) and **vector stores**. Detected via in-process client libraries and observed network connections to standard database ports. Risks here surface PII flowing through agent sessions, missing encryption on the data source itself, and PII egress to third-party AI providers.

### LLM

The language models in use: externally-hosted commercial models, cloud-provider-hosted models, and locally-served open-weight models. Plus the inference traffic that flows to them. Risks include unsanctioned providers, missing prompt-injection defence, and PII reaching external endpoints.

### MCP

MCP (Model Context Protocol) servers and the tools they expose. Each MCP server is a structured connector your agents can call. Risks include over-permissive tool catalogues, unapproved servers, and dangerous tool combinations.

### Runtime

Container, sandbox, and process-level concerns: the environment your agents and connectors run in. Risks include over-privileged containers, lateral access, missing sandboxing, and unmanaged shell access from agent code.

### Supply

Supply chain: the third-party code your AI stack depends on. Packages (with their version, ecosystem, licence, and CVEs), the libraries they pull in, and AI models loaded via deserialisable formats (pickle, torch) where arbitrary-code execution at load time is a risk. Findings here surface CVE-affected package versions and unsafe-pickle model loading. See [Supply Chain](supply-chain.md) for the per-component inventory.

## Stack layers

Findings also group by **stack layer**: a vertical slice of the platform that owns a specific kind of risk. Same findings, different axis.

* **Interface.** The public front door: REST, GraphQL, WebSocket entry points, WAF, rate limiting, DDoS protection, schema validation.
* **Identity.** Authentication and Non-Human Identity (NHI). On-Behalf-Of tokens, service-to-service trust, agent identity assertions.
* **Orchestration.** The "agent manager" that sequences tool calls, routes intermediate results, prevents infinite loops, and enforces human-in-the-loop approvals.
* **Cognitive firewall.** The guardrail layer in front of the model: prompt-injection blocking, PII redaction, jailbreak detection.
* **Inference.** The model itself, commercial or self-hosted. Data-privacy concerns (zero retention, residency), model switching, fallback.
* **Protocol.** MCP servers and tools: tool inventory, parameter visibility, shadow-tool detection.
* **Connectivity.** External APIs and SaaS the agents call, plus any gateway or integration middleware in front of them.
* **Knowledge.** The memory: internal databases, vector stores, S3. Row-level security, RAG poisoning defence, sensitive-document handling.
* **Infrastructure.** The container and the code. Supply-chain scanning, runtime sandboxing, preventing shell access from agent code.

## Caller mix

Every observed session also carries a **caller class** that names *who* initiated the traffic. This is orthogonal to risk category. The seven classes:

* **Human (browser).** Interactive sessions from a real user in a web browser.
* **Human (CLI).** Operators using shell scripts, `curl`, internal tooling.
* **AI agent (known).** Agents whose fingerprint AI Hypervisor recognises.
* **AI agent (suspected).** Traffic shaped like agent activity but without a confirmed fingerprint.
* **Service internal.** Service-to-service calls inside your environment.
* **Infra probe.** Health checks, monitors, Kubernetes liveness probes.
* **Unknown.** Caller class cannot be classified yet.

A new app suddenly serving heavy *AI agent (suspected)* traffic is worth investigating: either there is a real agent integration nobody told you about, or someone is fingerprint-evading. The caller-class palette carries through to [User Tracks](user-tracks.md) and the Briefing's caller-mix tile.

## Severity rules

Severity is computed per detector but maps onto a unified four-level scale:

* **CVE severity.** CVSS v3 (low, medium, high, critical) inherited from the published advisory.
* **PII severity.** Driven by the data class: PCI or health → critical; email or phone → medium.
* **Injection / Auth / Access severity.** Detector-specific scoring on the call shape. Critical is reserved for cases that demonstrably succeeded, not merely attempted.
* **Compliance severity.** Driven by the framework: a Gap on SOC 2 CC6 is critical; a Partial on NIST RMF Measure is medium.

The aggregate **Security Score** (0–100, where 100 = no risk) summarises all open findings on a per-application basis. More findings, or higher severities, lower the score. The score and the raw finding counts are two views of the same data running in opposite directions.

## Where findings show up

| Surface | What it shows |
|---|---|
| [Briefing](briefing.md), *Findings by dimension* tile | Cross-tenant count of open findings per dimension (PII, threat, block, anomaly, shadow, auth, compliance, access, supply, cert, fidelity) |
| [Briefing](briefing.md), *Caller mix* bar | Per-application traffic share by caller class |
| [Patterns](patterns.md) | Clustered findings grouped by detector pattern across sessions |
| [Registry](registry.md) | Per-entity rollup of open findings |
| [Compliance](compliance.md) | Findings mapped to control-coverage status |
| [Compliance API export](compliance.md#evidence-period-attestation-and-export) | Aggregated counts and per-finding evidence packaged into the compliance bundle |
