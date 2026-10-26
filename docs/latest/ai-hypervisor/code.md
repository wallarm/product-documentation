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
  **rescans on every push** (the push webhook is registered) or **checks for new commits every
  5 minutes** (GitLab did not let the token add the webhook; the row says why). Both keep scanning
  current; nothing needs to be changed. A group that fails shows **Not syncing:** followed by the
  error.
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

1. In GitLab, open your group → **Settings** → **Access tokens** → **Add new token**. Set **Role**
   to **Maintainer** (recommended) and give it the scopes `read_api` (list the projects and read
   their dependency files) and `api` (register the push webhook, and open fix merge requests). This
   creates a bot user in your group; you can revoke it there at any time.

    GitLab lets only Maintainers add webhooks. With Maintainer, a push starts a scan at once. With a
    lower role, everything still works: every repository is checked for new commits every 5
    minutes, and a changed one is rescanned. GitLab does not allow changing the role of an existing
    token, so pick it when you create the token.
2. On the **Code** page, fill in **GitLab URL** (for example `https://gitlab.com`), **Group** (the
   group path, for example `my-company/platform`) and **Group access token**.
3. Click **Connect group**. The token is encrypted before it is stored and is never shown again.

To watch another group, click **Connect another group**. To stop syncing a group, click
**Disconnect** on it; findings already scanned stay.

### Fix a vulnerable dependency

1. Open **Remediations**. The top row clears the most risk.
2. To see only what can be fixed automatically, click **N the bot can fix** in the summary line.
3. Open a row. Its **Bot fix** line says, per repository, what a click will do:
    * **Open fix MR** — the fix is ready. Click it: the bot opens a **draft** merge request in each
      listed repository and links it here. Review it and let your CI run before you merge.
    * **Open fix MR (upgrades a dependency)** — the fixed version is only reachable by also moving
      the package that pins the vulnerable one (for example, a newer release of a framework). Its
      API may have changed, so check your CI result before merging.
    * **Computing** — the fix is being worked out; the button appears when it is ready.
    * **Not possible** — no merge request can fix it automatically; the reason is shown (see below).

The bot works out each fix before it offers the button, so the button never leads to a refusal. It
uses your repository's own package manager in an isolated sandbox: the lockfile is regenerated, not
edited by hand, and the merge request lists every package version the change moves — including
dependencies the fixed version itself requires. When the repository changes, the fix is checked
again before the merge request is opened.

Supported package managers: npm, Yarn and pnpm; Cargo; Go modules; pip, Poetry, Pipenv and uv;
Maven and Gradle; Bundler; Composer; pub; Mix; Terraform.

#### When the bot cannot fix a dependency

| What the row says | What it means | What to do |
|---|---|---|
| No published version fixes it | No release of the package has the fix yet. | Wait for a release, or remove or replace the package. |
| Another dependency's requirement pins it | A package you use requires the vulnerable version range (the row names it). | Upgrade or replace that package; the row shows how far the vulnerable one can move today. |
| Building a package from source is required | Updating would compile a package from its sources, which runs that package's own build code. The bot never runs third-party code next to your repository credential. | Update the dependency locally or in your CI. |
| A dependency is not reachable | A private module or git dependency the sandbox cannot fetch; the row lists its address. | Make it resolvable (for example, a local `replace` for a module in the same repository). |
| Already at a fixed version | The default branch no longer has the vulnerable version. | Nothing — the row clears after the next scan. |

<a id="navigation-out"></a>
## Where to go next

- [Supply Chain](supply-chain.md) — the same dependencies, seen from the running applications.
- [Registry](registry.md) — the applications these repositories produce.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Discover** → **Code** (after turning it on in **Settings → Features**).
- [Getting started](getting-started.md) → **Add more sources**.
