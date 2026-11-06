# Compliance <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="evidence-period-attestation-and-export"></a>

<a id="intro"></a>
## What this is

**Compliance** turns what the platform observed into one evidence report: control coverage
against AI frameworks, personal-data detections, your software bill of materials (SBOM) and its
CVEs, and an audit trail. You can download it as a PDF for an auditor, a board update or a GRC
tool.

<a id="layout"></a>
## What is on the screen

One scrolling report with **Download as PDF**, and a contents
list beside it that jumps to each section. **Download as PDF** opens your browser's print dialog —
choose **Save as PDF**; the file is the same document you see. The evidence period runs from the
first to the latest asset the platform recorded; there is no period picker.

<a id="frameworks"></a>
### Frameworks covered

The framework list: **SOC2**, **EU AI Act**, **NIST AI RMF**. The set is
fixed.

<a id="section-1"></a>
### Section 1: Executive summary

**Controls covered** (and gaps), **PII events** (and how many were blocked), **SBOM components**
(and their CVEs), and the **Security score** (with the total session count).

<a id="section-2"></a>
### Section 2: Report metadata

Who produced the evidence and from where: **Tenant**; the substrate — **Cluster**, **Nodes**,
**Namespaces**, **CRDs** and **Network policies** on Kubernetes, or **Deployment** and **Host OS** on
endpoints; **AI services** (assets and connections); **Data sources**; **Evidence period**.

<a id="section-3"></a>
### Section 3: Control coverage heatmap

For each framework, every control with its **Status** — **Covered**, **Partial**, **Gap** or
**N/A** — its
**Evidence source** (the signal behind it) and **Findings** (how many findings roll into it).

<a id="section-4"></a>
### Section 4

**Audit trail (sample of N events)** — platform events in the period: **Timestamp**, event type,
**Detail**, **App**. Below it, when any exist, **Manual certifications (N)**: **Timestamp**,
**Asset**, **Type**, **Certified**, **By**, **Reason**. With no audit events the section is titled
**Manual certifications**; with neither, it is left out.

<a id="section-5"></a>
### Section 5: SBOM inventory summary

Total components, the top ecosystems, and the most affected components with their versions and CVE
counts.

<a id="section-6"></a>
### Section 6: PII detection summary

Personal-data detections the workspace holds, by type (the 20 most frequent) and by blocked versus
detected.

<a id="section-7"></a>
### Section 7: Attestation

The platform's closing attestation: **System**, **Scanner** version, the substrate (cluster and
nodes, or deployment), **Generated at** (UTC) and **Evidence period**.

### When this page is empty

The report is built from what the platform has observed so far. On a new workspace most numbers
are zero until the scanner reports traffic, findings and packages. See
[Getting started](getting-started.md).

<a id="how-to-use-it"></a>
## How to use it

### Give the report to an auditor
Click **Download as PDF**, choose **Save as PDF** in the print dialog, and attach the file. The first page carries the period, the workspace and
the frameworks.

### Brief leadership
Use **Section 1: Executive summary**. The other sections back each headline number with its
evidence.

<a id="navigation-out"></a>
## Where to go next

- [Data Governor](data-governor.md) — the personal-data rules behind **Section 6**.
- [Supply Chain](supply-chain.md) — the packages and CVEs behind **Section 5**.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Govern** → **Compliance**.
- From **Briefing** — the compliance links in its tray and metric details.
