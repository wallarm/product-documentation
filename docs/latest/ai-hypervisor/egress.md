# Egress <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Egress** shows which people send data to AI services — ChatGPT, Claude, Copilot and others —
from where, and which software made the call. It ranks users so the most unusual activity comes
first.

Two sources feed it: **macOS endpoints** (one row per machine) and the **cluster scanner**, whose
AI calls from Kubernetes workloads appear per namespace as `Kubernetes · <namespace>`. Install
either as described in [Getting started](getting-started.md).

<a id="layout"></a>
## What is on the screen

- The look-back window at the top: **24h**, **7d** (the default), **30d** or **90d**. Every count
  and table on the page follows it.
- Three totals for the window: **users**, **with non-human callers**, **with new AI services**.
- **Users table**, most unusual first: **User**, **Non-human**, **New** (for the window, e.g.
  **New 7d**), **AI providers**, **AI hosts**, **Sources** (the machines and namespaces the user's
  AI calls came from), **AI flows**.

The order is computed from three signals, strongest first:

1. **Non-human** — calls made by software (a script, a service) under a person's identity.
2. **New** — AI services this user reached for the first time in the window.
3. **AI providers** / **AI hosts** — how many different AI services the user reaches.

A single call to something nobody else uses ranks above thousands of calls to your usual
provider. The table shows the top users only — it is a triage list, not a full inventory.

Click a user to open **AI egress for** that user: one row per destination with **Destination**,
**Provider**, **Process** (the program that made the call), **Source** and **Flows**, plus **JA4** —
a fingerprint of the TLS client that opened the connection, which identifies the software or
library making the call.

### When this page is empty

**No AI egress discovered yet.** Either nothing is installed that feeds this page (a macOS endpoint
or the cluster scanner), or nothing has called an AI service in the selected window.

<a id="how-to-use-it"></a>
## How to use it

### Triage from the top
Read down the table until the rows stop being surprising. Click a row to see the source, the
program and the destination behind it.

### Separate scripts from people
A row ranked high on **Non-human** usually means a script or service account uses someone's
credentials. Check the **Process** and **JA4** columns in the user's detail.

### Catch a new AI service early
**New** (for the window) is the earliest sign that someone started using an AI service nobody approved.

<a id="navigation-out"></a>
## Where to go next

- [Settings → Scanners](settings.md) — confirm the endpoints are enrolled and the cluster scanner reports.
- [Traffic](user-tracks.md) — every request of your applications, AI and other, session by session.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Discover** → **Egress**.
