# AI Spend <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**AI Spend** shows what your AI usage costs this month, joined to its risk: which agents spend the
most, whether the priciest are also the riskiest, and how much AI usage bypasses anything you can
measure. Spend is estimated from the token counts the scanner recorded on AI calls, priced at the
model's list price; it is not your provider's invoice.

AI Spend opens inside [Briefing](briefing.md).

<a id="layout"></a>
## What is on the screen

1. **This month** — spend so far this month, with the change against last
   month (**▲ / ▼ N% vs last month**), and beside it:
   - **Governed (measured)** — spend the platform observed over the last 30 days, with the agents
     and models behind it.
   - **Ungoverned · Shadow AI** — workloads seen calling AI services outside anything measured.
     Shown as a count of workloads, not money: their cost is unknown, so your real bill is higher.
   - **Avg agent risk** — average agent risk, where **100 is the most at risk**.
   - **Identities tracked** — how many distinct callers the spend is attributed to.
2. **Findings a gateway cannot answer** — four cards:
   - **Your priciest agent is also your riskiest**
   - **AI spend you cannot see**
   - **Cost burned in a redundant loop**
   - **A cost spike that lines up with injection**

   A card with nothing to report says so, for example **No ungoverned AI detected.**
3. **Top agents by spend and risk** — the biggest spenders, each with
   its risk.
4. **Spend × risk** — the same agents plotted by cost and risk. The
   agents that are both expensive and exposed stand apart in one corner.
5. The spend breakdown by identity, role and model.

### When this page is empty

**No agent spend yet.** Spend appears once applications make LLM calls that the scanner records.
See [Getting started](getting-started.md).

<a id="how-to-use-it"></a>
## How to use it

### Start with the four cards
They are the questions a billing tool cannot answer. Click one to see the evidence.

### Read Ungoverned as a coverage warning
Every total on this page leaves out ungoverned workloads. If **Ungoverned · Shadow AI** is not zero,
treat the measured spend as a minimum and bring those workloads under coverage from
**Registry → Shadow**.

### Pick what to work on
Use **Spend × risk**: agents that are both expensive and risky are where cost and security point the
same way.

**Avg agent risk** rises with danger (100 = most at risk). The **Security score** on Briefing falls
with danger (100 = no risk). They describe the same estate from opposite ends.

<a id="navigation-out"></a>
## Where to go next

| From | You land in |
|---|---|
| **AI spend you cannot see** | The **Shadow** exposure card on Briefing |
| **A cost spike that lines up with injection** | The finding's evidence on Briefing |
| **Your priciest agent is also your riskiest**, an agent row, **Cost burned in a redundant loop** | That agent's evidence from [Traffic](user-tracks.md), opened over Briefing: its sensitive-data records when it has data-exposure findings, otherwise its sessions |

<a id="navigation-in"></a>
## How you get here

- **Briefing** → **AI Spend** in the tray.
- **View AI Spend →** on the spend card in a Briefing view.
