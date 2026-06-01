# AI Hypervisor Overview <a href="#subscription"><img src="../../images/ai-hypervisor-tag.svg" style="border: none;"></a>

AI Hypervisor is the runtime governance layer for every LLM call, agent action, and MCP tool invocation running in your Kubernetes cluster on AWS.

A Wallarm DaemonSet attaches to your AI workloads through Extended Berkeley Packet Filter (eBPF) and patented non-invasive memory analysis (US Patent 12,505,228). It produces a live inventory of every agent, model provider, MCP server, and data source your applications talk to, and attributes each call to the user who triggered it across every internal service hop.

No SDK, no application code changes, no pod restart to instrument. Label a workload, and the scanner attaches in place.

!!! info "AWS only"
    AI Hypervisor is available on **Amazon EKS** only. Your AI workloads must run on EKS, and the HIGGS Scanner deploys into that same cluster.

## The problem AI Hypervisor solves

AI agents in production are a security blind spot. Engineering teams ship support bots, RAG systems, and agentic workflows that call OpenAI, Bedrock, Anthropic, hit internal databases, and act on behalf of users — and security has no live picture of what runs, what each agent sends where, what data it leaks, or who triggered each call.

AI Hypervisor closes that gap as a **Discover → Observe → Govern** arc:

| Pillar | What you get | Where in the product |
|---|---|---|
| **Discover** *(know what AI is running)* | Live inventory of every LLM provider, agent, MCP server, and tool — built from real traffic, not a declared list. Anthropic, OpenAI, AWS Bedrock, Azure OpenAI, Gemini, Cohere, Mistral, and Together are recognised out of the box; shadow AI surfaces next to approved providers. | [Heatmap](heatmap.md), [Registry](registry.md), [Topology](topology.md), [Hyper Graph](hyper-graph.md) |
| **Observe** *(know who triggered it)* | Every model call, agent step, and tool invocation attributed to the originating end user across every service hop. Replay prompts, reconstruct incident timelines, attribute LLM cost by user and team. | [User Tracks](user-tracks.md), [Data Tracks](data-tracks.md) |
| **Govern** *(prove it to auditors)* | PII flow records, AI-SBOM with CVE enrichment, full session replay — mapped to EU AI Act, SOC 2, and NIST AI RMF controls. | [Reports](reports.md) |

## Who AI Hypervisor is for

* **Security leaders who own AI risk** — want visibility, attribution, and audit posture for AI traffic on par with the rest of their workload portfolio.
* **Platform and AI infrastructure leaders** running mixed-language workloads (Python, Node, Go, Java, Ruby) who want one consistent answer to *"what is calling what, and is it safe?"* without a per-language tool to operate.
* **Compliance and audit owners** who need to prove what data left for which model provider, on whose behalf, on demand — without reconstructing the evidence from spreadsheets.

AI Hypervisor supplements your existing APM, log pipeline, and SIEM rather than replacing them. It runs inside your own Kubernetes cluster on AWS; observed traffic does not leave your environment.

## How it works

AI Hypervisor splits into two pieces with a clean boundary between them: a scanner you run, and a tenant Wallarm hosts.

<!-- TODO: add architecture diagram — customer EKS cluster (HIGGS Scanner DaemonSet + AI workload pods) → HTTPS → Wallarm-hosted tenant (dashboard, backend, ClickHouse) on *.hypervisor.wallarm-cloud.com -->

**On your side — Amazon EKS:**

* The **HIGGS Scanner** (Hypervisor Inspection & GenerativeAI Guarding Scanner) runs as a Kubernetes DaemonSet — one pod per worker node — installed via Helm. It is the only AI Hypervisor component you install yourself; see [Install HIGGS Scanner](deploy.md).
* The scanner attaches to your AI workload processes through **eBPF and non-invasive memory analysis**, without any SDK, sidecar, or code change. Observation happens at the connection level inside the kernel, before the outbound call reaches the network stack.
* Supported runtimes for in-process introspection: Python, Node.js, Go, Java, Ruby. Other runtimes are still discovered at the network layer.
* The scanner uploads observations over HTTPS to your hosted tenant.

**On Wallarm's side — your tenant:**

* The dashboard, backend, and telemetry store (ClickHouse) are **hosted by Wallarm** at `<your-tenant>.play.hypervisor.wallarm-cloud.com`. There is nothing extra to operate; updates roll out without an upgrade window on your side.
* The platform inventories every commercial provider (Anthropic, OpenAI, AWS Bedrock, Azure OpenAI, Gemini, Cohere, Mistral, Together, and others — see [Supported Model Providers](supported-providers.md)) and self-hosted inference endpoint your agents talk to.
* Sessions, prompts, tool calls, PII flows, and compliance evidence are stitched together per tenant and made available through the UI surfaces listed in the [pillar table](#the-problem-ai-hypervisor-solves) above.

### Cross-hop user attribution

When a browser request enters service A which calls service B which calls an LLM, AI Hypervisor attributes the LLM call to the original user. Stitching works through the W3C `traceparent` header when intermediate services propagate it, and through kernel thread-ID correlation when they do not.

### The in-tenant agent

A built-in conversational agent — surfaced as the chat strip on the Briefing view — answers questions about your findings ("explain this", "why does it matter", "what should I do") and produces tailored remediation suggestions. The agent runs on **Bedrock-hosted Claude in your own AWS account**, called via IAM-authenticated EKS Pod Identity; finding metadata is sent, full prompt payloads are not, and nothing leaves your AWS account. See [Briefing → Ask the Agent](briefing.md#ask-the-agent).

### Key concepts

**Application** — a logical group of workloads under one governance boundary. A tenant typically defines one application per Kubernetes namespace, or per business domain (`checkout-api`, `support-bot`, `internal-rag`).

**Asset** — anything the platform observes: an agent process, an MCP server, an LLM provider endpoint, a data source, an API. Every asset is classified into one of seven **asset domains** (Agents, API, Data, LLM, MCP, Runtime, Supply).

**Finding** — a discrete record of something worth attention on a specific asset. Each finding is tagged with one of seven **risk categories** (Access, Authentication, Compliance, CVE, Injection, PII, Shadow). Findings roll up into per-asset and per-application risk scores on [Heatmap](heatmap.md).

**Session** — a request-to-response chain initiated by a single user or upstream caller, traced across every service hop the request triggers. Sessions are the unit of evidence in [User Tracks](user-tracks.md).

**Governance state** — every asset is one of three: **sanctioned** (explicitly approved into the baseline), **tolerated** (discovered but not yet approved), or **unsanctioned** (observed only via external signals — shadow AI). [Registry](registry.md) carries the controls to move assets between states.

## Subscription

AI Hypervisor is a **standalone annual subscription**, separate from Wallarm API Security. It is billed through the [AWS Marketplace listing](https://aws.amazon.com/marketplace/pp/prodview-6kyrg6lh4nshm) as a private offer and appears as a line item on your AWS bill — no separate invoice from Wallarm.

The subscription covers:

* The Wallarm-hosted tenant: dashboard, backend, and telemetry store.
* The HIGGS Scanner Helm chart for your own EKS cluster, including version upgrades.
* Wallarm product support.

Sizing is tiered by vCPU Licensed Capacity and observed request volume, measured at the 95th percentile over a rolling 30-day window. The AWS resources the scanner runs on (worker-node compute and egress) are billed by AWS as usual, not by Wallarm.

To request a private offer, tier capacities, and pricing, [contact Wallarm sales](https://www.wallarm.com/contact/ai-hypervisor).

## Next steps

* [Request a tenant and install the HIGGS Scanner](deploy.md) into your Kubernetes cluster through Helm.
* Tour the [Heatmap](heatmap.md) — the single-screen overview of your AI estate.
* Inventory your assets in [Registry](registry.md) and promote tolerated entities into the sanctioned baseline.
* Generate your first compliance artifact from [Reports](reports.md).
