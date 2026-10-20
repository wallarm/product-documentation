# Supply Chain <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Supply Chain** lists the third-party code and models your AI applications run on — libraries,
frameworks, base packages, ML models, model providers — and the known vulnerabilities (CVEs) in
them. It also flags model files that can run code when loaded (pickle risk) and where sensitive
data is exposed.

The scanner builds this from the packages it finds inside your running applications.

<a id="layout"></a>
## What is on the screen

- **Application dropdown** — **All applications** or one application.
- A summary line: across applications, `N applications · M CVEs`; for one application,
  `N components · M CVEs · K pickle risks`.
- **Type filter** — **All types**, **Services**, **ML models**, **Frameworks**, **Libraries**,
  **Base packages**, **Providers**. Each shows how many components and CVEs it holds.
- **Search components, CVEs…**
- **Overview** — opens the **Supply chain overview** (AI-SBOM analysis): **Components**, **Total
  CVEs**, **Unverified**, **Pickle risk**, CVE severity and components by type.

**All applications**: **Table** / **Cards**. **Table** shows the **Vulnerability Summary** and a
**Per-Application Breakdown**, applications with the most CVEs first. **Cards** shows one card per
application — click a card to switch to that application.

**One application**: its **Vulnerability Summary** and **Sensitive Data Exposure**.

Click a CVE for its details: **Severity**, **Description**, **Affected Component**, when it was
**Published** and in which version it is **Fixed in**, **Downstream Impact** and **Recommended
Actions**. Click a sensitive-data entry for its exposures, encryption status and applicable
regulations.

### Scan status per application

| Badge | Meaning |
|---|---|
| **Scanned** *time* | The last scan finished at that time. |
| **Pending** | Waiting for the first scan, or for the scanner to pick up a Monitor/Enforce request. |
| **Scan failed** | The scanner reported a failure; hover for the reason. |
| **Not onboarded** | No scanner covers this application yet. |

### When this page is empty

- **No supply chain components yet** — the scanner has not reported for this application.
- **Pending: waiting for the first scan** — the scanner sees the application's pods; the first
  scan arrives within a scanner cycle.
- **Pending: waiting for the scanner** — Monitor or Enforce was requested for the namespace; the
  scanner applies it on its next cycle, then scans.
- **Onboarding failed** — shows the reason the scanner reported.

When the scanner has seen a namespace calling AI services that is not opted in, the empty page
offers **Monitor** and **Enforce** for it. See [Getting started](getting-started.md).

<a id="how-to-use-it"></a>
## How to use it

### Find what needs patching
1. Choose **All applications** → **Table**. The **Per-Application Breakdown** lists the
   applications with the most CVEs first.
2. Pick the worst application in the application dropdown.
3. Click a CVE and read **Fixed in** and **Recommended Actions**.

### Check ML models for unsafe formats
1. Set the type filter to **ML models**.
2. Open **Overview** and read **Pickle risk** — model files that can execute code when loaded.

### Find a specific CVE
Type its id or the package name into **Search components, CVEs…**.

<a id="navigation-out"></a>
## Where to go next

- [Code](code.md) — the same vulnerable packages in your source repositories, with a fix you can
  open as a merge request.
- [Settings → Scanners](settings.md) — why an application shows **Pending** or **Scan failed**.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Discover** → **Supply Chain**.
- A new-CVE notification → **Review in Supply Chain** — opens the analysis for that application.
- A new-CVE notification → a CVE id — opens that application with the vulnerability's details open.
- [Heatmap](heatmap.md) → an expanded cell → a package finding — opens that application with the
  package's details open. If the application no longer has the package or CVE, a line above the
  page says so.
