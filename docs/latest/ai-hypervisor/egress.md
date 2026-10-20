# Egress <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Egress** shows which people send data to AI services from their devices — ChatGPT, Claude,
Copilot and others — and which software on the device made the call. It ranks users so the most
unusual activity comes first.

Egress is filled by the **macOS endpoint** only. Kubernetes, ECS and Fargate scanners do not feed
this page; their AI traffic is in [Traffic](user-tracks.md). Install the endpoint as described in
[Getting started](getting-started.md).

<a id="layout"></a>
## What is on the screen

- Three totals: **Users with AI egress**, **Non-human callers**, **New services (24h)**.
- **Users table**, most unusual first: **User**, **Non-human**, **New 24h**, **AI providers**,
  **AI hosts**, **Devices**, **AI flows**.

The order is computed from three signals, strongest first:

1. **Non-human** — calls made by software (a script, a service) under a person's identity.
2. **New 24h** — AI services this user had not reached before.
3. **AI providers** / **AI hosts** — how many different AI services the user reaches.

A single call to something nobody else uses ranks above thousands of calls to your usual
provider. The table shows the top users only — it is a triage list, not a full inventory.

Click a user to open **AI egress for** that user: one row per destination with **Destination**,
**Provider**, **Process** (the program that made the call), **Device** and **Flows**, plus **JA4** —
a fingerprint of the TLS client that opened the connection, which identifies the software or
library making the call.

### When this page is empty

**No AI egress discovered yet.** Either no macOS endpoint is enrolled, or the enrolled devices have
not called an AI service yet.

<a id="how-to-use-it"></a>
## How to use it

### Triage from the top
Read down the table until the rows stop being surprising. Click a row to see the device, the
program and the destination behind it.

### Separate scripts from people
A row ranked high on **Non-human** usually means a script or service account uses someone's
credentials. Check the **Process** and **JA4** columns in the user's detail.

### Catch a new AI service early
**New 24h** is the earliest sign that someone started using an AI service nobody approved.

<a id="navigation-out"></a>
## Where to go next

- [Settings → Scanners](settings.md) — confirm the endpoint devices are enrolled.
- [Traffic](user-tracks.md) — AI traffic from your Kubernetes, ECS and Fargate applications.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Discover** → **Egress**.
