# Briefing <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="ask-the-agent"></a><a id="role-and-altitude"></a><a id="what-you-see"></a>

<a id="intro"></a>
## What this is

The Briefing is the home of the AI Hypervisor — the surface you land on when you sign in, and the one you return to between tasks. It answers, in priority order, *what needs my attention right now, why, and what can I do about it* — and lets you act on any of it without leaving the page.

Where the other sections are each a deep, single-subject workspace (one for the inventory, one for sessions, one for data flows), the Briefing is the layer above them: it reads across all of that live runtime data, ranks what matters, and opens the right workspace one click away when you want to go deeper. Everything on it is built from the same underlying **[findings](#finding)** the rest of the product counts.

The Briefing adapts to your role through the **View as** control: the same estate, framed for the question you are asking. Picking a view — *Executive*, *Security Engineer*, *Platform Engineer*, *Compliance*, or *Developer* — changes which panels lead and which finding dimensions show; the data underneath is the same.

<a id="finding"></a>
### What a finding is

A **finding** is a single risk issue the platform has detected — a discrete record of something worth attention. Every finding has a **[dimension](#dimensions)** — the kind of risk it represents — and the **asset** it applies to.

One vulnerability on one dependency is one finding. One sensitive-data exposure in one session is one finding. One ungoverned AI vendor talking to one agent is one finding. Every count on the Briefing — every posture number, every pattern, the security score — is an aggregation of these finding records. This is the canonical definition the whole product shares; the other sections (Heatmap, Registry, Compliance) count the same findings from their own angle.

A finding has a **severity** (critical / high / medium / low / info), and the Briefing makes that severity legible: open a finding and the **[Why this severity?](#finding-detail)** section explains, in plain language, the one factor that set the level and the others that raised or contextualized it.

<a id="dimensions"></a>
### Findings by dimension

The Briefing's taxonomy of risk is the **dimension** — the kind of risk a finding represents. The **Findings by dimension** rollup shows one cell per dimension with its open-finding count and worst severity, so you can see at a glance where risk is concentrated. The dimensions:

- **PII** — sensitive data touched, flowing, or leaving for an external provider.
- **Threat** — adversarial or anomalous runtime behavior, including prompt injection.
- **Block** — actions the platform stopped at runtime (also reflects Behavior Certificate and egress blocks).
- **Anomaly** — statistically unusual behavior that does not fit the other dimensions.
- **Shadow** — AI components seen in external signals but absent from the inventory.
- **Auth** — authentication: identity verification, token validity, session integrity.
- **Comply** — controls lacking runtime evidence against your audited frameworks.
- **Access** — who is allowed to reach which agents, tools, or data sources.
- **Supply** — vulnerable or unsafe third-party code and models in the stack.
- **Cert** — an agent acting outside its signed Behavior Certificate.
- **Fidelity** — hallucination or off-intent responses flagged by the platform.

Which dimensions appear depends on the **View as** view: *Security Engineer* and *Platform Engineer* show every dimension; *Executive* focuses on Threat, Comply, and Shadow; *Compliance* on Comply, Cert, Access, PII, and Supply; *Developer* on Supply, PII, Threat, Fidelity, and Anomaly. The Patterns panel groups the same findings under fuller labels (Data exposure, Active threats, Enforcement blocks, Shadow / ungoverned AI, Access & authentication, …).

The dimension is the Briefing's cut of risk. The [Heatmap](heatmap.md) takes a different, matrix-shaped cut of the same finding records (its risk-category columns) — same findings, different axis.

<a id="security-score"></a>
### The Security score

Risk rolls up into a single **Security score** (0–100), where **100 = no risk**. Every open [finding](#finding) pushes the score down, weighted by its severity — the more open findings, and the more severe they are, the lower the score. The same logic scoped to one asset gives that asset's risk; an asset's risk is the worst of its open findings.

The score and a raw finding count run in opposite directions on purpose: more findings means a *higher* count but a *lower* score. Both are views of the same finding set. Marking a finding a **[false positive](#finding-detail)** removes it from the active set, so the count drops and the score recomputes.

<a id="layout"></a>
## What is on the Briefing

### When the Briefing is empty

On a new workspace, with no applications scanned yet, the Briefing shows **No applications scanned
yet** and a **Scanner deploy command** box with the commands to install the scanner on Kubernetes,
already filled in with your workspace address and key. The **?** next to the heading opens
[Getting started](getting-started.md), which covers every platform. The same commands are always
in **Settings → Scanners** — the link **Settings** under the box goes there.

### The first days

For a set time after the first AI session is recorded, the Briefing shows a first-day view that
says it is still building the picture; during that time nothing is reported as an anomaly, because
everything is new. After that it switches to its normal view, which compares against the baseline
it has learned and calls out anomalies. The length is **Onboarding length** in
**Settings → Preferences → Demo / Onboarding** (default 7 days).

### Customize the layout

Click **Customize** (next to **View as**) to rearrange the Briefing's blocks by dragging them. Click
**Save layout** to keep it, **Cancel** to discard, or **Reset to defaults**. Each **View as** view
keeps its own layout.

### Top to bottom

In page order, plus the side panel:

<a id="altitude"></a>
**1. The View as switcher** — the control that reframes the whole page for your role. It reads **View as <view>**; pick *Executive*, *Security Engineer*, *Platform Engineer*, *Compliance*, or *Developer*. Each view leads with different panels and shows a different subset of finding [dimensions](#dimensions). Your default comes from the role you pick at first run; you can change it at any time, and the choice is remembered.

<a id="platform-posture"></a>
**2. The Platform loop** — a strip of stages summarizing the runtime control plane: **AGENTS** (discovered), **SESSIONS** (captured 24h), **CERTS** (signed), **BLOCKS** (enforced 24h), **AUDIT** (events 24h). Each shows a live count. These are *raw-fact* counters — things that exist or happened — so they are not affected by finding triage. Click a stage to open it on the Briefing stage: **AGENTS** opens Registry on its Agents tab, **SESSIONS** the session list, **CERTS** the Behavior Certificates, **BLOCKS** the blocked sessions, **AUDIT** the Debugger.

<a id="operator-queue"></a>
**3. The Operator queue** — the list of concrete actions waiting on a human: sign a Behavior Certificate, review drift on a certificate, approve a drafted policy, re-sign a certificate. Each item opens the surface where you complete it.

<a id="dimension-rollup"></a>
**4. Findings by dimension** — a rollup with one cell per dimension, each showing its open-finding count and worst severity. This is the at-a-glance map of where risk sits; the dimensions shown follow the current **View as** view (see [the dimension list](#dimensions) above).

<a id="recent-incidents"></a>
**5. Recent incidents** — a chronological list of what the platform has acted on or flagged most recently. Each row routes to the right place: a session trace, a sensitive-data record, or a [finding detail](#finding-detail), depending on what underlies it.

<a id="heads-up"></a>
**6. The "Heads up" prompt** — a summary callout ("Heads up — I have flagged N findings") naming the most urgent unhandled finding with a one-line reason. It sits within the briefing narrative. **Mark seen** acknowledges it team-wide, so a teammate who already looked at something does not make it re-surface for everyone. A finding here can be opened straight into its [detail](#finding-detail).

<a id="patterns"></a>
**7. Patterns** (a dedicated panel) — open findings grouped into the recurring patterns behind them, ranked by impact (severity first, then how many sessions or assets each touches). Each pattern shows its risk severity, a plain one-liner, the agent's recommended next action, and two triage actions:
- **Mute** drops a noisy recurring pattern out of your working set into a collapsed **Muted** list (reversible, and shared across the team).
- **Details** opens the underlying finding's [detail](#finding-detail).

Below the active list sit two collapsed lists: **Muted** (patterns you have silenced) and **Dismissed / FP** (findings marked false-positive or resolved, each **Reopen**-able so a mistaken dismissal is never lost).

<a id="findings-panel"></a>
**8. The findings panel** — the list of open findings, grouped by category then type, down to individual [finding rows](#finding-detail); each row exposes its remediation primitives (block a destination, or govern it via a Behavior Certificate) plus owner and dominant caller identity. It is titled for the role view it sits in — **Needs a decision** (Executive), **Controls & evidence** (Compliance), **Issues by service** (Developer).

<a id="strategic"></a>
**9. The role views** — the **View as** control swaps the page for your role (Executive, Security Engineer, Platform Engineer, Compliance, Developer). Each role view is built from a couple of shared blocks plus a few role-specific ones:
- <a id="posture-tiles"></a> **Posture tiles** — a grid of trend tiles over a selectable window (24h / 7d / 30d / 90d); click a tile for its breakdown. Each view names this section for itself: Executive's **Posture & exposure** (scan coverage, shadow AI, AI agents, behavioral coverage, critical findings, PII egress, tokens), Platform's **Scanner & enforcement**, Compliance's **Compliance posture**, and Developer's **Your stack**.
- <a id="identity"></a> **Who is acting in your estate** (Executive) — splits recent activity by who and what is calling (humans vs AI agents vs services); click a segment to scope the view to that actor.
- <a id="needs-a-decision"></a> **Needs a decision** (Executive) — a plain-language summary of the exposure themes that need attention. It mirrors the right-hand [findings panel](#findings-panel): the summary frames the themes, the panel works them. The Executive view also shows a collapsed **Protection delivered** view of what enforcement actually blocked.

<a id="tray"></a>
**10. Tray** — the Briefing keeps the deep workspaces one gesture away. Picking a card from the Tray opens it on the **Stage**, an in-place panel, so you can act without losing your place. The cards: **Patterns**, **Topology**, **Registry**, **Shadow AI**, **Behavior Cert**, **Compliance**, **PII Movement**, **Debugger**, **AI Spend**, **AI Egress**, **Policies**. Which cards appear depends on the **View as** view.

<a id="finding-detail"></a>
## The finding detail

Opening any finding — from the "Heads up" prompt, a Pattern's **Details**, a Recent incident, or the findings panel — brings up its detail. This is where a finding becomes legible and actionable:

- **Why this severity?** — a plain-language verdict naming the one factor that set the level ("High — mainly because …"), followed by a structured breakdown that tags each contributing factor as the **Risk driver**, something that **Raises it**, or **Context**. No formula, no weights — just why, readably.
- **Suggest a tailored mitigation** — asks the agent for a fix written for this specific finding. A secondary action; the direct remediation buttons remain primary.
- **Remediation** — the primary action for the finding: block an unsanctioned destination, or apply the fix guidance for a vulnerability or posture issue.
- **The governance link** — jumps to the specific object the severity refers to: a certificate violation links to that agent's **Behavior Certificate**; a policy-governed finding links to the **Policies** surface.
- **Affected asset / sessions** — drills to the Registry asset or the underlying session traces behind the finding.
- **Triage** — **Mark false positive** removes the finding from the active set, so every finding-derived counter and the [Security score](#security-score) recompute; it stays reachable and **Reopen**-able under the Dismissed / FP list. (Mark seen and Mute live on the "Heads up" prompt and the Patterns panel respectively, not here.)

<a id="behavior-certificate"></a>
## The Behavior Certificate

A Behavior Certificate is a signed manifest of what one agent is allowed to do. Alongside the tools, hosts and data it may use, a certificate can carry **runtime clauses** that describe how the agent behaves inside its own container:

- **Libraries** — the packages it may load.
- **Programs** — the executables it may run.
- **Files** — the paths it may read and write.
- **Dynamic code** — the in-process code-execution it may perform (for example Python `exec`, `compile` or a dynamic import; Node `eval`, `new Function` or `vm`).

Each clause is off until you turn it on. A clause that is on with nothing listed allows nothing of that kind.

### Observed as it happens

Programs starting and regular files being opened are observed at the moment they occur, not sampled on a fixed interval. A short-lived program that starts and exits between two periodic reads is still seen, and periodic reads continue in the background to reconcile state. This means a violation is detected within seconds of the action rather than at the next sweep.

### In-process refusal for dynamic code

The agent's own Python and Node runtimes report the dynamic code they run against the certificate's **Dynamic code** clause. In **monitor** mode the operation runs and an observation is recorded. In **enforce** mode an operation that the clause does not allow is refused inside the process before it runs — the runtime raises its normal error (a `PermissionError` in Python, an `Error` in Node) so the agent's own error handling applies.

Only the application's own dynamic code is governed. Code that the language's standard library or an installed package builds or loads as part of its normal work — a web framework loading the app by name, a template engine compiling a template, a validator generating code — is neither reported nor refused. Which packages an agent may load at all is the **Libraries** clause.

The in-process check is part of the scanner's agent injection and is switched by the scanner's Helm value `agents.runtimePolicy` (on by default). With it set to `false` the Dynamic code clause is not checked inside the process; programs, files and libraries are still observed by the scanner.

### Enforce mode contains the agent

When an enforce-mode certificate is broken — a program, file, library or dynamic-code operation outside its clauses — the agent is **contained**: the proxy refuses every request the agent makes until you lift the containment, re-sign the certificate, or revoke it. In monitor mode the same violation is recorded as a finding and nothing is refused.

### When the Node code hook cannot load

For Node agents, direct `eval` is watched by a small native hook. On a runtime where that hook cannot load, the agent reports a `node:native_hook_unavailable` observation instead of silently going unwatched. Under an enforce certificate that does not list this value as allowed, that report contains the agent — so the safe default is to refuse rather than let unobserved code run. To keep a specific Node runtime running where the hook is unavailable, add `node:native_hook_unavailable` to the Dynamic code clause deliberately.

### Create and sign a certificate

Open an agent's certificate from a finding's governance link, from the agent in **Registry**, or
from **A2AS**.

1. With no certificate yet, choose how to start:
   - **Draft from observed behavior** — freezes the tools, destinations and data shapes the agent
     used over the last 7 days into a draft.
   - **Create from scratch** — an empty draft you fill in.
2. Edit the draft. The **Editor** selector switches between **Form — no YAML** and **Raw YAML**.
   The form holds:
   - **Enforcement posture** — **Wire enforcement**: **Enforce** (violations are refused at the
     proxy with HTTP 403) or **Monitor** (record only); **Tools not in this certificate**: block
     them in enforce mode, or record only.
   - Destinations — **Host** and **Protocols** for each allowed destination.
   - Tools — **Tool name** and **Max / session** (empty means no limit).
   - **Data shapes** — **PII egress** and **Canary egress** (block or allow), **Max PII records /
     response**.
   - Users — **User pattern** (for example `*@acme.com`).
   - **Auth** — **Key set (JWKS URL)**, **Issuer (optional)**, **Method**, **Rotation (days)**.
   - The runtime clauses described above.
3. Compare against the signed version in the diff, then click **Sign & Apply**.
   **Re-draft from latest behavior** refreshes the draft from what was observed since; **Discard**
   drops it.

### After signing

- **Edit & Re-sign** changes the certificate and signs a new version.
- **Revoke** withdraws it. A revoked certificate can be signed again as the next version, or
  replaced with **Draft a new certificate instead**.
- Behaviour outside the certificate creates update proposals. Approving one gives you a draft:
  click **Review & sign**.
- A contained agent shows **Lift containment**. Lifting lets its traffic flow again; if it is
  still doing what contained it, it is contained again when the scanner next reports it (within
  30 minutes). To allow the behaviour for good, add it to the certificate and re-sign.

<a id="how-to-use-it"></a>
## How to use it

### Triage top-down
Start with the Platform loop: it shows the state of the control plane, the Operator queue lists what needs a signature or approval, and Findings by dimension maps where risk is concentrated. Work through the Patterns panel in order of impact; the "Heads up" prompt calls out the single loudest issue when there is one.

### Open a finding to understand its severity
When a severity looks wrong or unclear, open the finding and read **Why this severity?**. The Risk-driver tag points at the one factor that set the level; the other factors show what raised or merely contextualized it.

### Act without leaving
Use the remediation buttons on the finding detail to block or govern a finding directly. For deeper context, the Tray opens the Registry, a Behavior Certificate, Policies, the topology, or a session trace on the Stage — you act there and return to the Briefing.

### Cut the noise honestly
**Mute** a recurring pattern to clear your working set without changing any counts. **Mark false positive** only when a finding is not a real risk — that one *does* change the counts and the score, so it is reserved for genuine non-issues and is always reversible from the Dismissed / FP list.

### Change the view for the question
Each **View as** view is tuned to a role: **Executive** for trends, exposure, and decisions to take into a review; **Security Engineer** for the live queue and pattern work; **Platform Engineer** for scanner and enforcement health; **Compliance** for control evidence; **Developer** for your stack's findings.

<a id="navigation-out"></a>
## Where the Briefing takes you

The Briefing is the hub — almost every other section is reachable from it, either by drilling a finding or by opening a workspace from the Tray.

| From this affordance | You land in |
|---|---|
| Platform loop stage | Registry (Agents), sessions, Behavior Certificates, blocked sessions or Debugger — on the Stage |
| A finding's affected asset | [Registry](registry.md), with the asset activated |
| A finding's affected sessions | [Traffic](user-tracks.md), filtered to those sessions |
| A sensitive-data incident | [Traffic](user-tracks.md), in its **Sensitive data** view |
| The governance link on a finding | The agent's Behavior Certificate, or the Policies surface |
| A Tray card | That workspace, on the Stage |
| `?` icon anywhere | This doc, in the help panel |

Every other page is in the sidebar. The [Heatmap](heatmap.md) is a matrix-shaped lens on the same findings.

<a id="navigation-in"></a>
## How you get here

The Briefing is where you land after sign-in. To come back, click **Briefing** in the sidebar.

<a id="settings"></a>
## Settings that affect the Briefing

- **Role** — picked at first run (and changeable later); decides your default **[View as](#altitude)** view.
- **Scan frequency** — configured in Settings; decides how fresh the posture counts, patterns, and scores are.
- **Onboarding length** (**Settings → Preferences**) — how long the first-day view lasts.

What appears is built from the applications you opted in to scanning (see [Getting started](getting-started.md)); it is not configured tile by tile.
