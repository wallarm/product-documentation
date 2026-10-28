# Settings <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="cluster-infrastructure"></a>

<a id="intro"></a>
## What this is

**Settings** holds everything that applies to your whole workspace: the scanners and their install
commands, which optional pages are switched on, your team, prompt-injection protection, updates,
and preferences such as scan frequency.

To open it: click your name in the sidebar, then **Settings**.

<a id="layout"></a>
## What is on the screen

Four tabs: **Preferences**, **Scanners**, **Data** and **Features**.

### Preferences

- **Theme** — the color scheme. Kept across sessions.
- **Show zero-data applications in aggregate view** — when on, applications with no data for a
  page still appear on it as empty cards.
- **Replay tour** — runs the first-visit walkthrough again. Shown only when **Guided tour** is on in
  **Features**.
- **Scan frequency (seconds)** — how often the scanner reports.
  Default `300`; allowed `60` to `86400`. Most counts in the product are only as fresh as this.
- **Kill duration — operator kills** — how long an identity stays blocked after someone clicks
  **Kill Session**. Default `1440` minutes (24 hours). The kill dialog starts at this value.
- **Kill duration — automatic rule blocks** — how long an identity stays blocked when an
  enforcement rule blocks it. Default `60` minutes. A single rule can override it.

Changes to these fields are staged: click **Apply** to save them or
**Reset** to discard them.

- **Demo / Onboarding** → **Onboarding length** — how long
  [Briefing](briefing.md) shows its first-day view before switching to its normal view. A duration
  such as `5m`, `2h` or `7d`. Default `7d`. Saved on **Save**.

<a id="prompt-injection"></a>
- **Prompt-injection protection** — detects prompt injection,
  jailbreaks and attempts to exfiltrate secrets in your applications' LLM traffic. It runs in the
  scanner's proxy, so it needs the proxy installed (see [Getting started](getting-started.md)).
  - Mode: **Off** (default), **Monitor — detect, do not block**, **Enforce — block attacks**.
    Changes apply within a minute, with no redeploy.
  - **Deep ML classifier** — **On — add ML classifier** adds a machine-learning classifier to the
    rule-based detection.
  - **Scale under heavy traffic** — **On — keep up under load** lets the
    classifier add capacity during traffic spikes so it keeps checking every request. Turn the ML
    classifier on first. Applies to this workspace only.

### Scanners

- After you change a policy, a progress bar shows the scanners picking it up. When every
  reporting scanner has it, the bar reads **live on N/N scanners** for a moment, then hides.
- **Estate layering** — how workloads are grouped into
  applications and cloud accounts: **Cloud account label (on-prem)**, **App tags**, **Pinned
  layers**. Each control shows the command to run against your cluster.
- **Cluster Infrastructure** — the clusters your scanners report from: **Cluster**, **Cloud**,
  **Nodes**, **Namespaces**. Appears once a scanner has reported.
- **Scanner Targets** — the header shows how many scanner daemons are online and how many
  applications they monitor.
  - **Scanner deploy command** — the install commands with your workspace address and key filled
    in, in four tabs: **Kubernetes**, **AWS Fargate**,
    **AWS ECS on EC2**, **macOS endpoint**. Step by step: [Getting started](getting-started.md).
  - **Scanner Version Status** — each scanner's version; scanners behind the latest release are
    marked. **Upgrade** on an outdated row, or **Upgrade all outdated (N)**, starts an upgrade of
    the whole scanner fleet (a confirmation says so), and its progress shows below.
  - **Scanner auto-update** — **Automatic updates**: **Stable releases**, **Every release** or
    **Off**. **Check and install** looks for a scanner update now.
  - One row per monitored application. Expand a row for its **Pulses**, **Packages**, **Since**,
    **Last scan**, and the scanner's **Memory**, **CPU**, **Scan time** and **Disk**. Row actions: **Re-scan**, **Pause** / **Unpause**, **Delete**,
    **Wipe Data**, **Logs**. A new row shows **No scan data yet** until its first scan uploads.
- **Scanner Nodes Without Targets** — scanner nodes that are running but have nothing opted in.
  Appears only when there are such nodes.
- **Scanner key** — the key your scanners sign with: where a key rotation stands, how many active
  scanners use each key, scanners being refused for a key the workspace no longer accepts, and the
  next step. Owners only. Needs no setup.

On a workspace that has only macOS or other device endpoints, this tab says so: there are no
Kubernetes scanner nodes, and enforcement runs on the device.

### Data

- **Usage** — usage per cluster for the period.
- **Team Members** — click it to expand. Invite a teammate: type the address into **Invite by
  email**, pick a role, click **Invite**. You can change a member's role in the list.
- **Access Control** — roles and their permissions; **New Role** creates one. Shown only to members
  whose role can view member settings.
- **API Tokens** — **Create Token** gives programmatic access: **Name**, **Expires**, **Scope**.
- **Platform updates** — **Automatic updates**: **Stable releases**, **Every release** or **Off**.
  **Check and install** looks for an update now.
- **Platform version** — the version your workspace runs. See [Versioning](versioning.md).
- **Danger Zone** — only the workspace owner can use it, and it is disabled until at least one
  application has been scanned. **Rescan all applications** re-runs every scan. **Wipe entire
  database** deletes all scan data and cannot be undone.

### Features

Switches for optional pages. Changes apply right away, with no **Apply** step.

- **Code** — adds the [Code](code.md) page (source repositories). Scanning repositories also
  needs Code enabled for your workspace deployment; ask Wallarm support if connected repositories
  stay **Pending**.
- **Cloud Discovery (AWS accounts + VPC Traffic Mirroring)** — adds the [Discovery](discovery.md)
  page.
- **Guided tour (first-visit onboarding)** — shows the walkthrough on first visit and the **Replay
  tour** button.

<a id="how-to-use-it"></a>
## How to use it

### Add a scanner or another cluster
1. Open **Scanners** → **Scanner deploy command**.
2. Pick the tab for where your applications run and run the commands shown.
3. Opt namespaces in — see [Getting started](getting-started.md).

### Turn on prompt-injection protection
1. Make sure the scanner was installed with the proxy (`--set proxy.enabled=true`).
2. Set the mode to **Monitor — detect, do not block** and leave it while your applications run.
3. Check what it detected, then switch to **Enforce — block attacks**.

### Rotate the scanner key

Rotate routinely, or at once if the key may have leaked. Scanners keep sending throughout: both keys
are accepted until you retire the old one, and scanners pick up a new key without a restart. Nothing
needs to be set up first.

1. Open **Scanners** → **Scanner key** → click **Start rotation**. The new key is shown once — copy it.
2. Deliver it where you manage the key yourself:
   - **Kubernetes:** change it where the key comes from — your secret manager (Vault, External
     Secrets, Vault Secrets Operator, Sealed Secrets: see `scannerKey` in
     [Helm chart values](chart-values.md)), the Kubernetes Secret named by `existingSecret`, or the
     `scannerPrivateKey` Helm value. Nothing else changes; GitOps installs need no commit.
   - **Everything else fetches it by itself:** AWS ECS on EC2, AWS Fargate, EC2 hosts installed from
     the package or the container unit, Android devices, and macOS endpoints that are not enrolled.
     They check every 5 minutes and switch on their own. macOS endpoints enrolled with a device
     certificate do not use the scanner key at all and are not affected.

   Scanners switch about two minutes after they get the key, so that every part of the platform
   accepts it first.
3. Watch the count: when it reads **N of N active scanners use the new key**, click **Promote the new
   key**. A scanner not seen for over 15 minutes (for example, a node that was scaled away) is not
   counted. A scanner that is being *refused* is shown separately, with the key it presents — it is
   broken, not gone; give it the current key.
4. Click **Retire the previous key**. If an active scanner still uses it, the confirmation names it.
   For 30 days a scanner that still holds the retired key can fetch the new one — and do nothing
   else — so one that starts later with the old key (a new Fargate task, a replaced host, a device
   that was offline) recovers by itself.

To stop a rotation before promoting, click **Abort rotation**. If some scanners already switched to
the new key, the confirmation names them. They go back to the current key on their own: for 30 days a
scanner still holding the dropped key can fetch the current one — and do nothing else — so even one
that was offline during the abort recovers at its next check. A Kubernetes scanner you gave the new
key by hand needs the current key again where you set it.

If the key has leaked, click **Emergency rotation** instead: the old key — and every retired key —
stops working at once, none of them can fetch the new one, and every scanner loses access until it
gets the new key.

Scanners re-read and fetch the key without a restart from scanner version 2.17.0; `scannerKey`
sources need 2.17.3. Older scanners
need a restart (for example, `helm upgrade`) to pick up the new key.

**Where a fetched key is kept.** ECS on EC2 and EC2 hosts keep it on the host
(`/var/lib/aih-scanner/scanner-key`, or `/var/lib/higgs/scanner-key` for the package), so it
survives restarts. With the Terraform modules, the scanner also writes the new key back to the
Secrets Manager secret (ECS) or SSM parameter (EC2) it was installed from — only once you promote
it — so hosts started later get it directly. Fargate keeps it on a task volume that only the scanner
container mounts.

### Invite a teammate
1. Open **Data** → click **Team Members**.
2. Type the address into **Invite by email**, pick a role, click **Invite**.

### When a page looks empty or stale
Open **Scanners** and check, in order: a scanner daemon is online, the application has a row,
the row's **Last scan** is recent, and the scanner is not behind the latest release.

<a id="navigation-out"></a>
## Where to go next

- [Getting started](getting-started.md) — install a scanner and opt namespaces in.
- [Versioning](versioning.md) — what the platform version means.

<a id="navigation-in"></a>
## How you get here

- Click your name in the sidebar → **Settings**.
- The **Settings** link in the empty **Briefing** ("You can always find this instruction in
  Settings").
