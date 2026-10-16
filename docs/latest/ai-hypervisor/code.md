# Code <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Code** checks the source repositories behind your AI applications. You connect a GitLab group
once; every repository in it is inventoried and re-checked, including repositories created later. The page shows what to fix — vulnerable dependencies, exposed secrets,
infrastructure-as-code misconfigurations and licences that need review — ranked so the fix that
clears the most risk comes first.

Nothing is installed in your repositories. Your source code is not stored: only the findings are.

**Code** is hidden by default. Turn it on in **Settings → Features → Code**; it then appears in the
sidebar under **Discover**. The switch shows the page; scanning repositories also needs Code enabled
for your workspace deployment — if connected repositories stay **Pending**, ask Wallarm support.

<a id="layout"></a>
## What is on the screen

- One row per connected GitLab group: its path, how many repositories it has, and either
  **rescans on push** (the push webhook is registered) or **rescans on the next sweep** (it is
  not). A group that fails shows **Not syncing:** followed by the error.
- A summary line: how many repositories, how many remediations, and how many **the bot can fix**.
- **Filter…** — narrows the current tab.
- Six tabs:

| Tab | What it shows |
|---|---|
| **Remediations** | One row per fix, ranked. Columns: **#**, **Remediation**, **Fix by**, **Repos**, **Clears**, **Severity**. |
| **Repositories** | One row per repository. A banner says how many are waiting for their first scan; a warning banner says when repositories are connected but **not being scanned** because no sync has completed recently. A repository whose last scan failed is marked as errored, not shown as clean. |
| **Provenance** | Which repository produced which running application. Applications that match no connected repository are listed separately. |
| **Secrets** | Secrets committed in source, at each repository's current commit. Values are always redacted. A secret removed in a later commit disappears from the list. |
| **IaC** | Misconfigurations in infrastructure-as-code files, at each repository's current commit. |
| **Licences** | Dependency licences that need review. Coverage is shown first. Packages whose licence cannot be read (for example Rust crates — `Cargo.lock` has no licence field) count as missing coverage, not as findings. |

### When this page is empty

With no group connected, the page shows **No source code connected yet** and the connect form. The
tabs appear once a group is connected. The first sync of a large group takes several passes;
**Repositories** shows how many are still pending.

<a id="how-to-use-it"></a>
## How to use it

### Connect a GitLab group

1. In GitLab, open your group → **Settings** → **Access tokens** → **Add new token**. Give it the
   scopes `read_api` (list the projects and read their dependency files) and `api` (register the
   push webhook that keeps scanning continuous). This creates a bot user in your group; you can
   revoke it there at any time.
2. On the **Code** page, fill in **GitLab URL** (for example `https://gitlab.com`), **Group** (the
   group path, for example `my-company/platform`) and **Group access token**.
3. Click **Connect group**. The token is encrypted before it is stored and is never shown again.

To watch another group, click **Connect another group**. To stop syncing a group, click
**Disconnect** on it; findings already scanned stay.

### Fix a vulnerable dependency

1. Open **Remediations**. The top row clears the most risk.
2. To see only what can be fixed automatically, click **N the bot can fix** in the summary line.
3. Open a row the bot can fix. Before you click, it says exactly which repositories it will
   touch. Click **Open fix MR**: the bot opens a draft merge request that bumps the package to the
   fixed version in each of them, and lists any it skipped with the reason. Review and merge in
   GitLab.

<a id="navigation-out"></a>
## Where to go next

- [Supply Chain](supply-chain.md) — the same dependencies, seen from the running applications.
- [Registry](registry.md) — the applications these repositories produce.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Discover** → **Code** (after turning it on in **Settings → Features**).
- [Getting started](getting-started.md) → **Add more sources**.
