# Audit Log <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Audit Log** records who did what and when: session kills and their reversals, blocks and lifts,
overrides and other accountability actions, by people and by rules. Use it to answer "who changed
this, and when?".

It records decisions, not traffic. A request a rule blocked appears in **Hits**; the kill or block
decision appears here.

<a id="layout"></a>
## What is on the screen

- **Application dropdown** — **All applications** or one application.
- Two tabs: **Audit Log** and **Events**.

### Audit Log

One row per action, newest first. Columns: **Action**, **Actor** (the person or rule that acted),
**Target** (the application or object acted on), **Result**, **Time**. Click a column header to sort.

### Events

The stream of platform events: **Message**, **Type**, **Severity**, **App**, **Time**.

### When this page is empty

**No audit events yet.** Entries appear when people or rules act — kills, blocks and their
reversals. A new workspace has none until the first such action.

<a id="how-to-use-it"></a>
## How to use it

### Find out who changed something
Pick the application, then read **Actor** and **Time** for the **Action** you care about.

### Rebuild an incident timeline
Sort by **Time** and read the decisions in order.

### Check an automated action had an owner
A kill or block whose **Actor** is a rule, with no human decision near it, is worth a review of
that rule in [Enforcement](enforcement.md).

<a id="navigation-out"></a>
## Where to go next

- [Enforcement](enforcement.md) — the rules and the **Block List** behind kills and blocks.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Protect** → **Audit Log**.
