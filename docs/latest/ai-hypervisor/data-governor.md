# Data Governor <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Data Governor** decides what counts as sensitive data and what happens when it leaves your
applications. You define the patterns (**Detect**), choose what to do when matching data goes out
(**Enforce**), and check what actually happened (**Audit**).

The rules apply to the whole workspace. Anyone can view them; only roles with edit rights can
change them — for others the controls are disabled.

<a id="layout"></a>
## What is on the screen

Three tabs: **Detect**, **Enforce**, **Audit**.

### Detect — what is sensitive

The **PII rules** list, with a search (**Search id, pattern, description…**), a category filter
(**All categories**) and **Refresh**.

- **New rule** — **ID**, **Rule type**, **Category**, **Severity**, **Pattern (regex)**,
  **Validator**, **Field keys (comma-separated)**, **Exclude patterns (comma-separated)**, **Min
  confidence**, **Description**, **Enabled**.
- **Edit** / **Delete** — the pencil and bin icons on each row. To stop a built-in rule, edit it and
  clear **Enabled**: a deleted built-in rule is added back on the next upgrade. Rules you add and
  edits you make are kept across upgrades.
- **Dry-run** — in the rule editor, paste sample text under **Dry-run** and click **Test pattern**
  to see what the pattern and validator match, before saving.
- **Export YAML** / **Import YAML** — move rules in and out as a file. **Replace existing rules on
  import** replaces instead of adding.

### Enforce — what happens when it leaves

The policy sits in the **DLP Policy (N)** section. Its header says how many enforce-mode pods it
applies to, shows the policy version (it changes on every save), and **● applied** once the
scanners run that version or **○ propagating…** until they do.

- **Default mode** — what happens to sensitive data in outbound traffic that no rule covers:
  `observe`, `simulate`, `warn`, `block` or `redact`.
- **Rules** — **New rule** sets a **Mode** for specific **Data classes**. The list shows **Data
  classes**, **Mode**, **Scope** and **Actions**.
- **Enforce DLP on namespaces** — choose which namespaces enforce this policy. Selected namespaces
  are routed through the scanner proxy and enforced; the rest are only observed. Changes apply on
  the scanner's next policy check.

**No pods are in enforce mode** means no namespace enforces the policy yet: everything is
observed, nothing is blocked or redacted. On a macOS endpoint there are no pods: a `block` rule is
applied on the device and follows the endpoint's enforce mode.

### Audit — what happened

- **Enforcement coverage** — how much outbound traffic was inspected under the policy.
- **Live egress** — outbound events with sensitive data, newest first. Narrow it with **All
  actions** and **All modes**; **Load older events** pages back.
- **Inspection gaps** — traffic that could not be fully inspected, for example **Body truncated
  (encoding)** or **HTTP/2 not inspected**. **No inspection gaps** means everything in enforce
  mode was fully scanned.

### When this page is empty

**Detect** starts with the built-in PII rules. **Enforce** shows **No rules configured.** until you
add a rule. **Audit** fills when sensitive data leaves an application in an opted-in namespace.

<a id="how-to-use-it"></a>
## How to use it

### Add a detection rule safely
1. In **Detect**, click **New rule** and fill in the pattern.
2. Under **Dry-run**, paste real-looking samples and click **Test pattern**.
3. Save it, then watch **Audit** → **Live egress** before you block anything.

### Start blocking sensitive data
1. In **Enforce**, set **Default mode** to `observe` and add rules for the data classes you care
   about.
2. Under **Enforce DLP on namespaces**, select the namespaces to enforce.
3. Read **Audit** for a while, then switch the rules you trust to `block` or `redact`.

<a id="navigation-out"></a>
## Where to go next

- [Enforcement](enforcement.md) — runtime rules beyond personal data.
- [Compliance](compliance.md) — the evidence these rules produce.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Govern** → **Data Governor**.
- **Briefing** in its Compliance view → **Open Data Governor →**.
