# Red Team <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Red Team** is where you request a red-team assessment of your AI applications from Wallarm. You
choose what to test and how, see an estimate as you go, and send the request. The page does not run
attacks itself.

<a id="layout"></a>
## What is on the screen

A scope calculator and a **Quote summary**.

- Testing approach — **Automated scanning**, **Expert manual testing**, **Hybrid assessment**
  or **Continuous red team**, each with an estimated duration.
- **Assets** — what to include: **AI agents**, **MCP servers**, **LLM providers**, **External
  APIs**, **User endpoints**. The counts come from what the scanner found in your workspace.
- **Risk areas** — **Prompt injection**, **Jailbreak attacks**, **Data exfiltration**, **PII
  exposure**, **Tool/function abuse**, **Privilege escalation**, **Supply chain**,
  **DoS/resource exhaustion**.
- **Environment complexity** — from **Simple** to **Enterprise**.
- **Project name**, **Description & requirements**, **Contact email**, **Preferred timeline** (for
  example **Urgent (ASAP)** or **Flexible**).
- **Quote summary** — **Estimated investment**, **Cost breakdown** and **Scope summary**
  (**Categories**, **Assets**, **Risk areas**, **Method**), updated live.

<a id="how-to-use-it"></a>
## How to use it

### Request an assessment
1. Pick a testing approach.
2. Tick the **Assets** and **Risk areas** to cover and set **Environment complexity**.
3. Fill in **Project name**, **Description & requirements**, **Contact email** and **Preferred
   timeline**.
4. Check the **Quote summary**, then click **Request proposal**.

The page shows **Request submitted** and keeps your choices. Wallarm receives the request and
replies to the contact email. To change the scope later, adjust it and click **Request new
proposal**.

### When this page is empty

The asset counts are zero until the scanner reports — you can still request an assessment. See
[Getting started](getting-started.md).

<a id="navigation-out"></a>
## Where to go next

- [Registry](registry.md) — the assets the counts come from.
- [Enforcement](enforcement.md) — the rules that should stop the attacks an assessment tries.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Protect** → **Red Team**.
