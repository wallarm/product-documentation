# Risk Model <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Risk Model** groups your findings and CVEs by the fix that resolves them. Many findings often
share one fix — upgrading one package, changing one policy — so each row here is one piece of
work, with how much risk it removes. It also shows the factors behind each score, so you can see
why something ranks where it does.

The page covers your whole workspace; it has no application dropdown.

<a id="layout"></a>
## What is on the screen

- **Rank by** — **Leverage (fewest actions)**, **Score (magnitude)** or **Severity (worst first)**.
- One row per group: its title, severity and leverage (**×N leverage** — how many findings the
  one fix resolves). Expand a row for:
  - **remediation** — the fix this group shares;
  - **underlying** — how many findings it groups;
  - **blast radius** — how many records are exposed;
  - **apps** — how many applications it spans;
  - the scoring factors and their values.

### When this page is empty

**No risk items yet.** Groups are built from findings and CVEs and refresh every few minutes. They
appear once the scanner has reported findings — see [Getting started](getting-started.md).

<a id="how-to-use-it"></a>
## How to use it

### Do the highest-leverage work first
1. Set **Rank by** to **Leverage (fewest actions)**.
2. Expand the top group and read its **remediation**.

### Get a fix suggestion
Expand a group and click **Suggest a fix for this group →**. A tailored suggestion is generated
for that group. Session ids in it are links — click one to open that session in
[Traffic](user-tracks.md).

### Close a group once it is fixed
1. Expand the group and click **Remediate group…**.
2. Read the preview: **Suppresses N finding(s) across M app(s)**.
3. Click **Confirm suppress-all**, or **Cancel**.

To reopen it, click **Undo (reopen group)**.

<a id="navigation-out"></a>
## Where to go next

- A session id in a suggested fix → that session in [Traffic](user-tracks.md).
- [Supply Chain](supply-chain.md) and [Code](code.md) — the CVEs behind dependency groups.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Observe** → **Risk Model**.
