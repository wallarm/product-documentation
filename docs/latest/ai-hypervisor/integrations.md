# Integrations <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Integrations** sends events from your workspace to the tools your team already uses: Slack,
PagerDuty, Splunk and Sumo Logic. A **connector** is the destination and its credentials; a
**pipeline** says which events go to which connector.

<a id="layout"></a>
## What is on the screen

Two tabs: **Pipelines** and **Connectors**.

### Connectors

A catalog of destinations with a search and category filter. These four can be connected:

| Connector | What you enter | Events it can receive |
|---|---|---|
| **Slack** | **Webhook URL** (a Slack incoming webhook) | Enforcement block, Session kill, PII alert |
| **PagerDuty** | **Routing Key**, **Events API Region** (**EU** or **US**) | Enforcement block, Session kill |
| **Sumo Logic** | **HTTP Source Collector URL** | Enforcement block, Session kill, PII alert |
| **Splunk** | **HEC URL**, **HEC Token**, **Index (optional)** | Enforcement block, Session kill, PII alert, CVE finding |

The form tells you where to find each value, for example in Splunk **Settings → Data Inputs → HTTP
Event Collector**, or in Sumo Logic **Manage Data → Collection → Add Source**. After connecting:
**Save**, **Test** (sends a test event), **Disconnect**. **Used in Pipelines** lists the pipelines
that send to it.

### Pipelines

Each pipeline sends chosen event types to one connector.

- **Pipeline name**.
- **Event types** — **Enforcement block** (an [Enforcement](enforcement.md) rule blocked or
  quarantined a session; refusals made inline by the scanner proxy — DLP, A2AS, a contained
  agent — are not sent), **Session kill** (someone used Kill Session), **PII alert** (personal data
  detected), **CVE finding** (a new vulnerability).
- The connector to deliver to.
- **Batching threshold** — how long to collect events before sending them together: **20
  seconds**, **30 seconds**, **1 minute**, **2 minutes**, **5 minutes**, **10 minutes**,
  **30 minutes** or **1 hour**.

Open a pipeline to see its **Event Types**, **Total Events**, whether it is **Active**, and **Edit
Pipeline**.

### When this page is empty

With no connector set up, the pipeline form says **Go to Connectors tab and configure an
integration first**.

<a id="how-to-use-it"></a>
## How to use it

### Send blocks to Slack
1. In Slack, create an incoming webhook for the channel and copy its URL.
2. Open **Connectors** → **Slack**, paste the **Webhook URL**, click **Save**, then **Test**.
3. Open **Pipelines**, create a pipeline, name it, tick **Enforcement block** and **Session
   kill**, pick **Slack**, choose a **Batching threshold**, save.

From then on, matching events are delivered automatically.

<a id="navigation-out"></a>
## Where to go next

- [Enforcement](enforcement.md) — the rules whose blocks become **Enforcement block** events.
- [Traffic](user-tracks.md) — where **Kill Session** produces **Session kill** events.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Govern** → **Integrations**.
