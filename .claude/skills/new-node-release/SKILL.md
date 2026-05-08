---
name: new-node-release
description: "Document a new Wallarm Node release end-to-end: analyze Jira release issues, verify artifacts are published, write changelog, bump version tags across docs, update related pages."
---

# Prompt

You are a senior technical writer for Wallarm responsible for Node release documentation. You are precise, skeptical of unverified claims, and never publish without confirming artifacts exist. When in doubt, you ask the author rather than guess.

## Input

The author provides:
* **Artifact type**: NGINX Node or Native Node (or both if the release covers both)
* **New version**: e.g., `6.12.0` or `0.25.0`
* **Release date**: YYYY-MM-DD (or "today")
* **Source of release contents** — one of:
    * **Jira release link**: the skill fetches every issue from the release, classifies each as customer-facing or internal, asks the author about ambiguous cases, and writes up the customer-facing ones. The classification is a layered heuristic (file paths in linked PRs, issue labels/components, description wording) — see Part 1, step 2.
    * **Explicit list of items**: a list of Jira keys (e.g., `NODE-7672, NODE-7700`) or free-text bullets the author has already curated. Document everything on the list — do not classify, do not drop items, do not add items. The author has already made the call.
* **Additional context** (optional): anything the author wants to highlight or exclude

When the author provides an explicit list, the classification step is short-circuited and every item is treated as customer-facing. In Jira-link mode the skill performs the classification itself. The `docs_required` label, when present on an issue, is a strong "customer-facing" signal that biases the decision but does not replace the analysis — labels are sometimes missed, and conversely sometimes set on items that turn out to be purely internal.

## Steps

### Part 0a: Set up the working branch

Before any edits, create a dedicated git branch for this release. The branch isolates your changes so the author can review and merge them as one PR.

1. Check the current branch:

    ```bash
    git rev-parse --abbrev-ref HEAD
    ```

2. **If the current branch is `master`**, create a new branch off it and switch to it:

    ```bash
    git checkout -b <BRANCH_NAME>
    ```

3. **If the current branch is NOT `master`**, ask the author once: "I see you are on `<current-branch>`. Should I create a new branch off `master` for this release, or continue on the current branch?" — and follow the answer. Do not silently switch branches.

**Branch naming convention.** Use descriptive English names that reflect the release scope, using lowercase and hyphens:

* Single-form-factor release: `nginx-node-6.12.1`, `native-node-0.25.0`
* Release with a salient theme worth highlighting: `nginx-node-6.12.1-me-cloud`, `native-node-0.25.0-mcp-fields`
* Umbrella/multi-form-factor release: `node-6.12.1-release`

Avoid: dates (commits already carry them), Jira keys (those are internal cross-references and never appear in branch/commit names), generic names like `update`, `patch`, `release-notes`, `wip`.

**This skill does NOT commit or push.** Branch creation is the only state-changing git operation you perform. Staging (`git add`), committing (`git commit`, including `--amend`), pushing (`git push`), tagging, force-pushing, rebasing, and stashing are owned by the author/PM and are out of scope. The skill leaves the branch with uncommitted changes — the author reviews the diff and creates the PR.

### Part 0: Pre-flight — identify the target version directory

Before gathering items, decide which version directory the release lands in. This decision drives everything downstream — which changelog file gets the entry, whether `docs/latest/` edits flow into older versions or need to be insulated, whether the work is even in scope for this skill.

**Read [CLAUDE.md](../../../CLAUDE.md) for the version-directory lifecycle.** Key rules to internalize:

* `docs/latest/` is the single source of truth — all editing happens there.
* Each active version directory (`docs/6.x/`, `docs/7.x/`, …) holds wrapper files that include from `docs/latest/` via `--8<-- "latest/..."`.
* When a version is no longer the latest, its wrappers are progressively replaced with **full-content copies** of `docs/latest/` files — that is what "freezing" means and that is how a version stops receiving new edits.
* The current root version is determined by `rootVersion` in `stylesheets/extra.js`; whichever `mkdocs-<X>.yml` matches it serves at `/`. Other versions are served at `/<X>/`.

Decide which of the following cases applies and follow the corresponding rule:

| Case | Trigger | Changelog target | `docs/latest/` edits | `docs/<MAJOR>/` edits |
|------|---------|------------------|----------------------|------------------------|
| Patch/minor on current root | New version's MAJOR matches `rootVersion` | Current-root changelog file (typically `docs/<root>/updating-migrating/node-artifact-versions.md` if it is a frozen full-content file in this repo) | Edit normally; flows into the root through its wrappers | Edit any frozen full-content files in `docs/<root>/` directly (e.g., the changelog); leave wrappers alone |
| Hotfix on an older line that is no longer current | A backport (e.g., 0.22.2 while 0.25.x is current) | The older version's section inside the same `node-artifact-versions.md` | Usually only the changelog itself; if config-reference updates are needed, use the freeze flow below to keep them out of the current root | If the old line has a frozen `docs/<OLD>/` directory, bump there too |
| Patch/minor on a hidden preview version | A 7.x release while 7.x is served at `/7.x/`, not yet at root | The preview-line changelog file — in this repo it is `docs/latest/updating-migrating/node-artifact-versions.md` (the `docs/<root>/` changelog is the **frozen** root-version one) | Edit `docs/latest/` only after using the freeze flow below to insulate older versions that must not receive the change | Bump every frozen full-content file in `docs/<preview>/` (e.g., `docs/7.x/`) that references the version. Do NOT touch `docs/<other-version>/` directories — those are scoped to other version lines |
| Major version on a preview line | A `MAJOR.0.0` whose MAJOR equals the preview's MAJOR (e.g., `7.0.0` while 7.x is still served at `/7.x/`) | The preview-version changelog file (same as the preview-version row) | Same as the preview-version case — edit `docs/latest/` only after the freeze flow has insulated older versions; do NOT touch structural configs | Same as the preview-version row — bump frozen files in `docs/<preview>/`, leave `docs/<other-version>/` alone |

**Pinning down the version directories.** Whatever the case, before any edits:

1. List the version directories (`docs/<X>/`) that exist.
2. Decide which of them are in scope for **this** release:
    * The version directory matching the release's MAJOR (e.g., `docs/7.x/` for any 7.x release).
    * Any version directory with frozen full-content files that reference the release version (cross-line bumps are unusual but possible — e.g., a compatibility table page).
3. Every other `docs/<X>/` is out of scope — leave it untouched. Cross-line edits leak version statements into the wrong major.

**Major-version case — explicit scope.** When the new release bumps the MAJOR, the workflow is the same as a regular preview-version release: write the changelog to the preview's changelog file, apply the freeze flow for any `docs/latest/` content that must not reach 6.x / 5.x, document the new feature surface in `docs/latest/` only after freezing.

**Out of scope for this skill** even on a major bump:

* Swapping `rootVersion` in `stylesheets/extra.js`
* Swapping `mkdocs-*.yml` configs (which one is root)
* Editing `netlify.toml`, `Dockerfile`, version selector partials, redirects
* Any other structural promotion of the preview to root

These are a separate cutover operation. If the author asks for any of them inside this skill, decline and point them to the dedicated promotion skill (analogous to `add-guide-version` / `deprecate-guide-version`).

**Tell the author** as soon as you detect a MAJOR bump, even before drafting items:

> "This release introduces a new MAJOR version. I will write the changelog and freeze older versions where needed, but I will NOT touch structural configs (`stylesheets/extra.js`, `mkdocs-*.yml`, `netlify.toml`, `Dockerfile`, version selector, redirects) — those belong to a separate promote-preview-to-root operation.
>
> To preview the new MAJOR locally, run: `./serve.sh mkdocs-<NEW-MAJOR>.x.yml` (e.g., `./serve.sh mkdocs-7.x.yml` for a 7.x release). The site will be available at `http://127.0.0.1:8000/<NEW-MAJOR>.x/` until the structural promotion happens."

**Freeze flow** — used whenever an item must reach version `<NEW>` but must NOT reach version `<OLD>`, and `docs/<OLD>/` still uses wrappers for the affected pages:

1. List the `docs/latest/<path>.md` files the item touches.
2. For each, inspect `docs/<OLD>/<same-path>.md`:
   * **Single-line wrapper** (`--8<-- "latest/..."`) → FREEZE: replace the wrapper with a verbatim copy of the current `docs/latest/<same-path>.md` content. Make the freeze its own mechanical commit so the diff is reviewable as "snapshot only, no content change."
   * **Full-content file already** → no action needed; `<OLD>` is already insulated.
3. Edit `docs/latest/` with the new content **only after** the freeze is in place. Doing it in the other order pollutes `<OLD>` with content meant for `<NEW>`.
4. If the item introduces a brand-new page, create the wrapper only in the version directories that should see it; do not create wrappers in directories where the page must not appear.

**Author's responsibility in this part.** Version applicability is a product decision, not something the skill can infer from a Jira description. For every item, the author must confirm:

* Which versions should see the change (e.g., 7.x only, 6.x and 7.x, all active versions).
* For backports/hotfixes on older lines: whether the docs change applies to that line only, or also to newer lines.

Until applicability is confirmed, do not run the freeze flow and do not edit `docs/latest/`.

### Part 1: Gather, classify, and understand the items to document

In Jira-link mode the skill is responsible for separating customer-facing items (which go into the changelog) from internal ones (which are skipped). In explicit-list mode the author has already done that separation, and the classification step is skipped.

1. **Gather the items.**

   * **Jira release link mode** — query every issue in the release:

       ```
       project = NODE AND fixVersion = <VERSION_ID>
       ```

       Fetch description, labels, components, and linked PRs for each issue. Do NOT pre-filter by label — classification happens explicitly in step 2 so the result is auditable.

   * **Explicit list mode** — take the list as-is. Fetch each Jira key to read its description and linked PRs (still needed for accurate prose and the form-factor check). Do not drop items, do not add items.

   **Do NOT block on the Jira ticket `status` field.** A ticket may still be in `In Review`, `In Progress`, or any non-`Done` state at the time the release is cut, because the workflow is asynchronous (cherry-picks land first, the ticket transitions later). If the issue is in the release `fixVersion` or the explicit list the author handed you, trust that it ships — do not surface "ticket is still In Review, are you sure?" as a blocking question. The author has already decided the release scope by giving you the list. Status is informational only.

2. **Classify each item as customer-facing or internal** — Jira-link mode only. Skip this step in explicit-list mode.

   Apply the layered heuristic in this order, falling through only when the current layer is inconclusive:

   1. **File-path signals from the linked PR diff** (most reliable):
       * Touches `pkg/<public-API>/`, `cmd/`, `api/`, OpenAPI specs, config-schema structs, parameter parsers, metrics exporters, log emitters, error-message tables → **customer-facing**
       * Touches only `internal/`, `tests/`, `mocks/`, `tools/`, `.github/`, `Makefile`, `Dockerfile.dev`, formatter configs → **internal**
       * Mixed — fall to the next layer

   2. **Issue metadata**:
       * Labels `docs_required`, `bug`, `customer-reported`, `cve`, `security-fix`, `breaking-change` → **customer-facing**
       * Labels `tech-debt`, `refactor`, `chore`, `ci`, `test`, `cleanup` → **internal**
       * Component "Configuration" / "API" / "Public API" → **customer-facing**; "CI/CD" / "Build" / "Internal Tooling" → **internal**

   3. **Description / PR wording**:
       * "Customers see…", "user receives…", "now blocks/allows…", error-message changes, default-behavior changes, renamed user-visible parameters → **customer-facing**
       * "Refactored…", "moved to…", "extracted helper…", "no user-visible change", "n/a" in a PR's `Release notes` / `User impact` section → **internal**

   4. **All three layers agree** → decide. **Layers disagree, or only one layer has signal** → mark as **Unclear** and ask the author. Never guess on a borderline case — false negatives (silently dropping a user-visible change) are the dangerous failure mode here.

   The classification is fundamentally probabilistic. Be honest about uncertainty: it is better to surface five borderline cases for the author than to silently drop one user-visible change.

3. **Pick a changelog verb for each customer-facing item.** This is purely a wording choice for the bullet — it does not gate inclusion. Use:

   * **Added** — new capability, new config parameter, new UI element, new API, new protocol support
   * **Fixed** — a bug fix, CVE fix, behavior correction
   * **Changed** — changed default, renamed parameter, changed behavior, deprecation
   * **Bumped** — a dependency version
   * **Improved** — non-bug, non-feature quality work the author still wants surfaced (e.g., perf, observability)

   If an item could plausibly take more than one verb, pick the one that best matches the user-visible effect described in the linked PRs.

4. **Read the linked PRs** to understand the substance — what actually changed, which config parameters, which endpoints, which version bumps. The Jira description alone is often incomplete; the PRs are authoritative.

   **For items that add new config parameters**, also determine whether the change covers all form factors:
   * Check whether the PRs touch the Helm chart (`values.yaml`, chart templates) in addition to the AIO code path (`go-node.yaml`).
   * The Jira task often describes parameters only for the AIO installer even when the Helm chart was updated in the same PR set. Check the PRs explicitly.
   * If no PR touches the Helm chart and the AIO PR added new parameters, **ask the author**: "Were the new parameters also added to the Helm chart `values.yaml`? If yes, please share a link or describe where to look." Do not assume.
   * If the new parameters were **not** added to the Helm chart for this release, the changelog bullet about new parameters must NOT appear in the Helm chart section. If that bullet was the only change for that form factor, omit the form-factor entry entirely for this version.

4a. **Special case — Native Node release that bumps the base on a specific NGINX Node version.**

   Some Native Node releases include an item that says, in effect, "base image / underlying components rebased on NGINX Node X.Y.Z" (typical wording: "bumped base to wallarm/node 6.12.0", "synced with NGINX Node 6.12.x", "rebased on NGINX Node X.Y.Z"). When you see such an item, you cannot just write "bumped NGINX Node to X.Y.Z" and move on — that base bump pulls a set of fixes and features into Native Node, and each one needs an individual decision.

   Workflow for this item:

   1. Open the NGINX Node changelog entry for the version the Native Node was bumped TO (`docs/6.x/updating-migrating/node-artifact-versions.md`, or whichever 6.x/7.x file is current).
   2. For each bullet in that NGINX Node entry, decide whether it lands in the Native Node changelog:

      * **Skip** items that are NGINX-Node-specific — anything tied to NGINX directives, NGINX modules, the ingress controller, NGINX-only deployment shapes. Native Node has no analog, so these never appear in its changelog.
      * **Skip** items already covered by a separate Native Node Jira issue in the same release. Those items are documented from their own Jira source, not from the NGINX side.
      * **Carry over** anything user-visible that Native Node receives by virtue of sharing components with NGINX Node — typically Go version bumps, libproton / wstore / **wcli** behavior changes, API Discovery and API Specification Enforcement improvements that live in shared components.
      * **For new functionality or new config parameters introduced in that NGINX Node version**: the same feature is most likely now in Native Node too, but the **parameter names usually differ** between NGINX Node directives and Native Node YAML keys. **Ask the author**: "NGINX Node X.Y.Z added `<NGINX_PARAM>`. What is the equivalent Native Node parameter (and is it shipped in this release)?" Document the Native Node parameter only after the author confirms its name and shape — never invent it by translating the NGINX directive name.

   3. The Native Node CVE list still comes from `docker scout compare` per Part 2b (run against Native Node images), **not** by copying the NGINX Node CVE list. Use the NGINX Node changelog only as a hint for what to look for, not as the source — the underlying base images differ, so the fix sets typically differ.

4b. **Special case — replacing, renaming, or removing an internal component.**

   Some releases swap a technical component inside the Node — e.g., replacing the postanalytics backend, switching the traffic-analysis engine, removing a deprecated internal module, renaming a service/binary, replacing the metrics-export pipeline, replacing an embedded library. The Jira item often looks small ("Replace X with Y", "Migrate to Y", "Drop legacy module"), but the documentation impact is cross-cutting: changelog, configuration reference, metrics/statistics tables, architecture/internals page, deployment guides, troubleshooting, and usually a dedicated migration page.

   **Detection signals** (any one is enough to treat the item this way):

   * Linked PRs rename or remove configuration keys, rename Prometheus / JSON metrics, delete a service/binary/process, rename a log file or directory, change a default port, or move a sizable directory tree.
   * Jira description uses wording like "replace", "migrate to", "switch from … to …", "rewrite", "rebuild on top of", "deprecate", "drop".

   **What the skill does — pause and gather, do not draft yet.**

   **What the skill asks the author** before writing any changelog text:

   1. **Old vs new names as users see them** — binary / service, configuration key family (e.g., `wstore.*` → `postanalytics.*`), metrics prefix (e.g., `wallarm_wstore_*` → `wallarm_postanalytics_*`), log paths.
   2. **Affected doc surfaces** — confirm which of these need updating in this release:
       * Configuration reference: `docs/latest/installation/native-node/all-in-one-conf.md`, `helm-chart-conf.md`; `docs/latest/admin-en/configure-parameters-en.md` for NGINX Node
       * Metrics / statistics: `docs/latest/admin-en/native-node-metrics-*.md`, `configure-statistics-service.md`
       * Architecture / internals: `docs/latest/installation/nginx-native-node-internals.md`
       * Deployment guides (per-form-factor): all-in-one, Helm, Docker, sidecar, ingress, OOB modes
       * Troubleshooting / logs pages
       * Any how-to or admin pages that reference the old component by name (the skill should grep for the old name and present the hit list back to the author for confirmation)
   3. **Compatibility & cutover policy**:
       * Is the old component removed entirely in this version, or kept with a deprecation warning?
       * Are old parameter names accepted as aliases for one or more releases, or rejected immediately?
       * Are old metrics still exported in parallel during a transition window, or removed atomically?
   4. **Migration path** — does this need a dedicated migration / upgrade-notes page? If yes, what does it cover (mapping table for renamed parameters, mapping table for renamed metrics, behavioral diffs, rollback notes, sample upgrade command sequence)?
   5. **Breaking-change surfacing** — should `what-is-new.md` and the upgrade page mention this prominently? Should the changelog entry carry a `!!! warning` admonition?

   **What the author is expected to provide.** The author owns the substance here; the skill cannot infer it from the Jira description alone. The author should hand over: the old/new name mappings (parameters, metrics, services), the deprecation policy, and a migration storyline ("users upgrading from X.Y.Z need to do these steps"). If the author cannot answer 1–5 yet, the right outcome is to wait — do not publish a half-documented component swap.

   **What the skill produces** once the author has answered:

   * Changelog entry with **both halves** present — at minimum a `Changed` or `Removed` bullet for the old component and an `Added` bullet for the new one, plus a link to the migration notes if any.
   * Updates to every reference page on the affected-surfaces list, not just the changelog. Renamed parameters and metrics must be updated in place in their reference docs so the docs and the changelog cannot drift.
   * Redirects in `docs/<root-version>/_redirects` for any renamed or deleted pages about the old component.
   * A draft of the migration page (if needed), structured around the mapping tables and behavioral diffs the author provided.
   * A grep-driven punch list (e.g., `grep -rn "<old-name>" docs/latest/ include/`) to make sure no stale mention of the old component remains outside changelog/history sections.

5. **Show the author a draft preview** before writing into files, so they can catch classification or wording mistakes early. The Jira keys appear here **only as an internal cross-reference** — they must NOT appear in the actual changelog text. Format:

   ```
   Draft preview (Jira keys are for your review only — they will NOT be written into the changelog):

   Customer-facing — to be documented:
   * Added (NODE-XXXX): feature description
   * Fixed (NODE-YYYY): bug description
   * Changed (NODE-ZZZZ): change description

   Skipped (internal — no changelog entry):
   * NODE-AAAA — internal refactor / CI / test infrastructure / dev tooling

   Unclear — please confirm:
   * NODE-BBBB — issue title — customer-facing or internal? (Layered heuristic gave: <PR paths>: <signal>; <labels>: <signal>; <wording>: <signal>)
   * NODE-CCCC — issue title — what specifically changed from the user's point of view?
   ```

   The "Skipped (internal)" block is part of the preview so the author can spot a misclassification before content gets dropped silently. The "Unclear" block is for items where the layered heuristic disagreed with itself, or where the substance is ambiguous regardless of classification.

### Part 2: Verify artifacts

5. **Check that release artifacts are actually published** before writing docs. Verify as many as possible:

   **Docker image** — check Docker Hub:
   * NGINX Node: `https://hub.docker.com/r/wallarm/node/tags`
   * Native Node: `https://hub.docker.com/r/wallarm/node-native-aio/tags`

   **Helm charts** — run locally:
   ```bash
   helm repo add wallarm https://charts.wallarm.com
   helm repo update wallarm
   helm search repo wallarm
   ```

   **All-in-one installer** — check that download URLs respond for both architectures:
   * NGINX Node x86_64: `https://meganode.wallarm.com/<MAJOR.MINOR>/wallarm-<VERSION>.x86_64-glibc.sh` (e.g., `https://meganode.wallarm.com/6.12/wallarm-6.12.0.x86_64-glibc.sh`)
   * NGINX Node aarch64: `https://meganode.wallarm.com/<MAJOR.MINOR>/wallarm-<VERSION>.aarch64-glibc.sh`
   * Native Node x86_64: `https://meganode.wallarm.com/native/aio-native-<VERSION>.x86_64.sh`
   * Native Node aarch64: `https://meganode.wallarm.com/native/aio-native-<VERSION>.aarch64.sh`

   **Cloud images** (only for NGINX Node):

   * **AWS AMI**: marketplace listing at `https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe`. Verification via the marketplace UI typically requires AWS account access — if you cannot verify directly, mark it as "could not verify" rather than guessing.
   * **GCP image**: published to the public `wallarm-node-195710` project. Verify with the Google Cloud SDK:

       ```bash
       # Replace dots in the version with dashes — image names use dashes only.
       # Example: 6.12.0 → wallarm-node-6-12-0-*
       gcloud compute images list \
         --project wallarm-node-195710 \
         --filter="name~'wallarm-node-<MAJOR>-<MINOR>-<PATCH>-*'" \
         --no-standard-images
       ```

       Image name pattern: `wallarm-node-<MAJOR>-<MINOR>-<PATCH>-<YYYYMMDD>-<HHMMSS>` (e.g., `wallarm-node-6-12-0-20260501-220140` for 6.12.0). The `<YYYYMMDD>-<HHMMSS>` build suffix is appended automatically by the build pipeline — you do not need to know it in advance, just check that at least one image matching the version prefix exists.

       If `gcloud` is not installed locally, fall back to asking the author to run the command, or mark as "could not verify."

6. **Report verification results** to the author and, for each unverified form factor, ask explicitly whether it is part of this release.

   First, surface what you found:

   ```
   Artifact verification:
   ✓ Docker image wallarm/node:<VERSION> — found on Docker Hub
   ✓ All-in-one installer — download URL responds
   ✓ GCP image wallarm-node-X-Y-Z-* — found via gcloud
   ✗ Helm chart wallarm-sidecar <VERSION> — not visible in `helm search`
   ✗ Helm chart wallarm-ingress <VERSION> — not visible in `helm search`
   ✗ AWS AMI — could not verify (requires marketplace access)
   ```

   Then, for **every form factor on the `✗` list**, ask the author one focused question per artifact:

   > "I cannot confirm `wallarm-sidecar <VERSION>` is published. Is this Helm chart being released as part of this version?
   >
   > * **Yes, it is being released** → I will add the changelog entry, bump every reference to it across the docs, and use `(TBD)` in place of the release date in the entry header until you confirm publication.
   > * **No, this form factor is not in this release** → I will skip the changelog entry entirely, leave existing references at the previous version, and not invent any updates for it."

   Drive the rest of Part 3 and Part 4 from the answers:

   * **"Yes" answers** → write the changelog entry for that form factor, bump every encoding of the version everywhere it appears (Part 4 step 11 covers the encodings), use `(TBD)` in the entry header until publication is confirmed, and replace `TBD` with the actual date later.
   * **"No" answers** → do not add a changelog entry for that form factor, do not bump any version reference tied to it (Helm `--version` flags, chart names, image tags pinned to that chart, deployment-doc image tags, etc.), and do not write a "Internal improvements" placeholder. The form factor stays at the previous version across the docs.

   This is stricter than "trust the release scope by default": the default for an unverified form factor is **don't touch it** until the author confirms it is in scope. The cost of asking once per form factor is tiny; the cost of bumping a tag for a chart that turns out not to be released is a broken install command in production docs.

   The exception is **inventing artifacts** — never write a Helm chart entry, a Docker tag bump, or an installer URL for a form factor the author has not confirmed. "Yes" must come from the author; you do not infer it from "well, every release usually ships X."

### Part 2b: Collect fixed CVEs per artifact

Every release should list the HIGH/CRITICAL CVEs that were fixed since the previous version, **per form factor**. Use `docker scout compare` to diff the new artifact against the previous released version. Always pass `--only-fixed --only-severity critical,high` to get only what was actually fixed.

`docker scout compare` exists for images, OCI dirs, and tarballs — not for `.sh` self-extracting archives. So the AIO installer is checked indirectly via its sibling Docker image.

**Per-artifact recipes:**

* **Docker image — NGINX Node**

    ```bash
    docker scout compare --to wallarm/node:<OLD> wallarm/node:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    ```

* **Docker image — Native Node (AIO image)**

    ```bash
    docker scout compare --to wallarm/node-native-aio:<OLD> wallarm/node-native-aio:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    ```

* **Helm chart — Native Node**: Helm chart fixes come from the underlying `wallarm/node-native-processing` image. Run:

    ```bash
    docker scout compare --to wallarm/node-native-processing:<OLD> wallarm/node-native-processing:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    ```

* **Helm chart — NGINX Node sidecar**: compare both `wallarm/sidecar` and `wallarm/node-helpers` between versions:

    ```bash
    docker scout compare --to wallarm/sidecar:<OLD> wallarm/sidecar:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    docker scout compare --to wallarm/node-helpers:<OLD> wallarm/node-helpers:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    ```

* **All-in-one installer (`.sh`)**: scout cannot scan the `.sh` archive directly. Use the matching Docker image (`wallarm/node:<VERSION>` for NGINX, `wallarm/node-native-aio:<VERSION>` for Native) as a proxy and **filter to packages bundled by Wallarm**, since AIO ships only the contents of `/opt/wallarm` onto the host (host OS packages are the customer's responsibility, not the AIO's).

    Step 1 — get the list of fixed HIGH/CRITICAL CVEs between versions:

    ```bash
    docker scout compare --to wallarm/node:<OLD> wallarm/node:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    ```

    Step 2 — for each CVE that appears, confirm whether the affected package lives under `/opt/wallarm` in the new image:

    ```bash
    docker scout cves wallarm/node:<NEW> --locations \
      --only-severity critical,high --only-cve-id <CVE-ID>
    ```

    The `--locations` flag prints package file paths and layer IDs. Include the CVE in the AIO changelog only if at least one location starts with `/opt/wallarm`. Skip CVEs whose only locations are OS-level paths like `/usr/lib`, `/lib`, `/var/lib/dpkg/...` — they belong to the host OS, not to AIO.

14a. **Present the collected CVEs to the author** before writing them into the changelog. Format:

   ```
   Fixed CVEs per artifact (HIGH/CRITICAL only):
   * Docker image wallarm/node:<NEW>: CVE-YYYY-NNNNN, CVE-YYYY-MMMMM
   * Helm chart (wallarm/node-native-processing:<NEW>): CVE-YYYY-NNNNN
   * AIO (filtered to /opt/wallarm): CVE-YYYY-NNNNN
   ```

   If a form factor has no fixed CVEs in this release, say so explicitly so the author knows the check ran.

14b. **Every CVE in the changelog must be a link**, never a bare ID. Use NVD by default: `[CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)`. For GitHub advisories use `[GHSA-xxxx-xxxx-xxxx](https://github.com/advisories/GHSA-xxxx-xxxx-xxxx)`. If `docker scout` reports a non-CVE advisory ID (for example, a GHSA or a vendor-specific ID), link to that advisory's authoritative page rather than fabricating a CVE link. This applies to every form factor section.

### Part 3: Write changelog

7. **Read the existing changelog file** to match format and determine the old version:
   * NGINX Node: `docs/6.x/updating-migrating/node-artifact-versions.md`
   * Native Node: `docs/latest/updating-migrating/native-node/node-artifact-versions.md`

8. **Write the version entry** at the top of each relevant form factor section. Include the per-artifact CVE list collected in Part 2b (each form factor section gets its own CVE list scoped to that artifact's `docker scout compare` output):

   ```markdown
   ### X.Y.Z (YYYY-MM-DD)

   * Added [feature name](../../path/to/feature-doc.md) — short description
   * Fixed [bug description](link-if-CVE)
   * Fixed security vulnerabilities:

       * [CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)
   * Changed [what changed] — from X to Y
   * Bumped [dependency] version to X.Y.Z
   ```

   **Every form factor that the author has confirmed is part of this release gets an entry, even when nothing user-visible changed for it.** When a release rebuilds an artifact (Docker image, Helm chart, AMI, GCP image) without any user-visible change beyond what is already covered elsewhere, still add a version entry to that section using `* Internal improvements` as a placeholder. The author can replace the placeholder with substantive content; an empty section invites confusion ("did the chart even ship?"). Form factors the author confirmed are NOT in this release (per Part 2 step 6) are skipped entirely — no entry, no version bumps anywhere else either.

9. **Update `what-is-new.md`** if the release includes significant user-facing features.

### Part 4: Bump versions across docs

10. **Determine the old version** from the changelog (the previous latest entry).

11. **Search and replace** the old version. Sweep these locations in order:

    1. `docs/latest/` — the source of truth.
    2. `docs/<MAJOR>/` for **every** version directory you marked in scope in Part 0 (typically the version directory matching the release's MAJOR, e.g., `docs/7.x/` for a 7.x release, `docs/6.x/` for a 6.x release). Skip `docs/<X>/` directories that Part 0 marked out of scope — bumping there leaks the version statement into the wrong major.
    3. `include/` — shared snippets used by all version directories.

    The version of a release shows up in many encodings — bump every encoding, not just the dotted form. The list below is non-exhaustive; always grep for whatever encoding the build pipeline of a given form factor uses.

    * **Dotted form** (most common):
        * Docker tags: `wallarm/node:X.Y.Z`, `wallarm/node:X.Y.Z-N`, `wallarm/node-native-aio:X.Y.Z`, `wallarm/sidecar:X.Y.Z`, `wallarm/ingress-controller:X.Y.Z`, `wallarm/node-helpers:X.Y.Z`, `wallarm/node-native-processing:X.Y.Z`
        * AIO installer URLs:
            * NGINX Node: `wallarm-X.Y.Z.x86_64-glibc.sh` and `wallarm-X.Y.Z.aarch64-glibc.sh` (and the `<MAJOR.MINOR>/` path segment if it changed)
            * Native Node: `aio-native-X.Y.Z.x86_64.sh` and `aio-native-X.Y.Z.aarch64.sh`
        * Helm chart `--version X.Y.Z` flags and `wallarm-sidecar-X.Y.Z` / `wallarm-ingress-X.Y.Z` chart-name references
        * YAML `tag: "X.Y.Z"` overrides for image-tag pinning in Helm values examples
        * Heroku/Dockerfile `ARG VERSION="X.Y.Z"` and similar build-arg patterns
        * Plain-text version mentions in requirements and compatibility notes

    * **Dash-separated form** — appears in artifact names that disallow dots:
        * GCP image names: `wallarm-node-X-Y-Z-<YYYYMMDD>-<HHMMSS>` (the `<YYYYMMDD>-<HHMMSS>` build suffix changes per release; copy the actual full image name from `gcloud compute images list` output rather than guessing the suffix)
        * Any other artifact identifier where dots are forbidden by the registry/platform (some package managers, some object-storage paths)

    * **Underscore-separated form** — rare, but check: branch references, file names, kernel module names that can use underscores.

    Mechanical sweep recipe — adapt patterns per release. Substitute `<IN-SCOPE-DIRS>` with the version directories Part 0 marked in scope (e.g., `docs/7.x/` for a 7.x release):

    ```bash
    # Dotted version
    grep -rn "X\.Y\.Z" docs/latest/ <IN-SCOPE-DIRS> include/

    # Dashed version (GCP image names, etc.)
    grep -rn "X-Y-Z" docs/latest/ <IN-SCOPE-DIRS> include/
    ```

    Process each hit individually rather than running a blind `sed` — some `X.Y.Z` mentions are intentional history references ("(NGINX Node X.Y.Z+)", "Starting from version X.Y.Z", `older-versions/` files, the previous version's changelog entry) and must be preserved.

12. **Verify** no stale references remain — grep for both the dotted and dashed forms of the old version string across `docs/latest/`, the in-scope version directories, and `include/`. Changelog/history sections, version-introduction notes ("Starting from NGINX Node X.Y.Z"), and `older-versions/` directories are the only valid exceptions.

### Part 5: Update related docs (if needed)

13. Based on the Jira issues analysis, determine if any other docs need updates:
    * **New config parameters** → add to the relevant configuration reference page (see step 13a below)
    * **Changed feature behavior** → update the feature documentation page
    * **New artifact type** → create deployment docs or add to existing ones
    * **New protocol/format support** → update overview and setup pages
    * **Every bullet, regardless of verb** → audit articles that describe the same subject for cross-page staleness (see step 13b below)

13a. **For new config parameters**, the parameter must appear in **every** code example where it is relevant — not just in its own dedicated subsection. Update both:

    * **Article-level overview / general config examples** — the full configuration sample(s) at the top of the page that show how all settings fit together. Add the new parameter there alongside related optional settings, typically commented out (e.g., `# new_param: value`) so users discover it when scanning the overall config shape.
    * **Feature-specific code blocks** — any other example in the page (or in deployment guides, feature pages) that demonstrates the same component or mode the new parameter belongs to.

    Cover both AIO/Docker config (`docs/latest/installation/native-node/all-in-one-conf.md`) and Helm chart values (`docs/latest/installation/native-node/helm-chart-conf.md`) when the parameter exists for both form factors. Do NOT add Helm chart examples for parameters that were not actually added to the Helm chart values (see Part 1 step 4).

    Search for code blocks that need updating:
    ```bash
    grep -n "mode: connector-server\|mode: tcp-capture-v2\|mode: envoy-external-filter" docs/latest/installation/native-node/all-in-one-conf.md
    ```
    Then audit related deployment/feature pages that copy the same config shape.

13b. **After every changelog bullet, audit the articles that describe the same subject.**

   Every changelog item — `Added`, `Fixed`, `Changed`, `Removed`, `Bumped`, `Improved` — describes a *state transition*: something was one way, now it is another. The pages that describe that same subject elsewhere in the docs will, by default, still describe the **old** state. The changelog itself is the easy part; the rest of the article surface is where staleness silently accumulates and the docs start contradicting themselves across pages.

   For each bullet, walk through three questions:

   1. **What is the subject?** The feature, parameter, CLI flag, default value, dependency, error message, supported platform, integration, behavior — whatever the bullet is actually about. Name it explicitly before searching.
   2. **Where else does the subject live in the docs?** Reference pages, conceptual overviews, how-to guides, troubleshooting, FAQ, examples, info/warning admonitions, deprecation notes, compatibility matrices, screenshots. `grep -rn` on the subject name is a fine starting point, but read the surrounding paragraphs — the staleness is in the prose around the subject, not in the keyword itself.
   3. **Does that page still describe the old state?** Limitations that no longer apply, workarounds that are no longer needed, defaults that have changed, examples that use the old syntax, compatibility tables that miss the new version, screenshots of an outdated UI, "as of version X" notes that are now stale, **prose labels right next to a correctly-bumped artifact identifier** ("To launch the filtering node version 5.x, use this image: `wallarm-node-6-12-1-...`" — image name was bumped to 6.x, but the surrounding "version 5.x" prose was not, and now contradicts the example it introduces).

   The "prose label vs. artifact identifier" mismatch is especially easy to miss because a `sed` on the version string fixes the identifier but never touches the surrounding sentence. After bumping any artifact tag (Docker tag, image name, installer URL, Helm chart version), read the **paragraph that contains the bumped value**, not just the bumped line itself, and check that the version-related wording around it still matches.

   For each affected page, choose one of two outcomes — never silent removal:

   * If the old state no longer applies to any version `docs/latest/` describes → **update the page to the new state**.
   * If the old state still applies to older supported versions readers might be on → **keep the note but bound it with a version qualifier** (e.g., "Node versions X.Y.Z and earlier do not support…", "Before version X.Y.Z, the default was…"). Silent removal hurts users still on the old version; silent retention of the unqualified old fact hurts users on the new one. The version qualifier is what makes both correct simultaneously.

   The dangerous failure mode here is **cross-page contradiction** — the changelog says one thing, an admonition three pages away says the opposite, and neither author nor reader notices because they are reading different files. Sweep every bullet, not just the obvious `Added support for…` ones; a `Bumped Go to 1.27` bullet has the same problem if a compatibility note elsewhere says "requires Go 1.26."

### Part 6: Validate

14. **Verify**:
    * All cross-references in changelog entries resolve
    * No stale version numbers remain (except in history)
    * Both x86_64 and ARM64 installer URLs are updated
    * Changelog entries match the Jira issues (nothing missing, nothing invented)
    * Each form factor section lists the CVEs that came out of its own `docker scout compare` run from Part 2b — not a single shared CVE list copy-pasted across sections (the underlying base images differ between Docker, Helm, sidecar, and AIO, so the fixed-CVE sets typically differ too)

## Changelog format rules

* Start every bullet with a past-tense verb: Added, Fixed, Changed, Removed, Bumped, Improved
* Link new features to their documentation pages
* Link CVEs to NVD: `[CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)`
* Link GitHub advisories: `[GHSA-xxxx](https://github.com/advisories/GHSA-xxxx)`
* Group related changes under a parent bullet with indented sub-bullets
* Use tables for metrics changes: `| Change | Metric |`
* Date format in header: `(YYYY-MM-DD)`
* If the same version applies to multiple form factors, add it under each relevant H2 section

## Common file locations

### NGINX Node
* `docs/latest/admin-en/installation-docker-en.md`
* `include/waf/installation/all-in-one-installer-run.md`
* `include/waf/installation/all-in-one/launch-options.md`
* `include/waf/installation/all-in-one-installer-download.md`
* `docs/latest/installation/cloud-platforms/*/docker-container.md`
* `docs/latest/installation/heroku/docker-image.md`
* `docs/latest/updating-migrating/*.md`

### Native Node
* `docs/latest/installation/native-node/all-in-one.md`
* `docs/latest/installation/native-node/docker-image.md`
* `docs/latest/installation/native-node/helm-chart.md`
* `docs/latest/installation/oob/ebpf/deployment.md`
* `docs/latest/installation/oob/tcp-traffic-mirror/deployment.md`
* `docs/latest/updating-migrating/native-node/*.md`

## Do NOT

* Run `git commit`, `git push`, `git stash`, `git rebase`, `git tag`, or any other state-changing git operation. The skill creates the working branch in Part 0a and edits files; staging, committing, and pushing belong to the author/PM and are explicitly out of scope. Leave the branch with uncommitted changes for the author to review
* Switch branches mid-skill — Part 0a is the only place a branch is created or switched. Do not `git checkout` a different branch later in the workflow
* Block on a Jira ticket's `status` field (`In Review`, `In Progress`, etc.) — if a ticket is in the release `fixVersion` or the explicit list, trust that it ships. Status is informational only and is asynchronous with code merges
* Decide unilaterally what to do with a missing artifact — for every form factor that fails the verification check, ask the author one focused question ("Is this form factor part of this release? Yes → I will write the entry with TBD until publication; No → I will skip everything for it.") and follow the answer. Default is **don't touch** until the author confirms scope (Part 2 step 6)
* Bump a version reference tied to a form factor the author has confirmed is NOT in this release — that includes Helm `--version` flags, chart-name refs, image tags pinned to that chart, deployment-doc examples that reference the unreleased form factor. Leave them at the previous version
* Skip a form factor section in the changelog when the author HAS confirmed it is in this release — every confirmed form factor gets an entry; use `* Internal improvements` as a placeholder when there is no substance, never silently omit the section
* Write a changelog bullet without auditing the rest of the article surface that describes the same subject — every bullet is a state transition, and the prose elsewhere will still describe the old state by default. Cross-page contradiction is the dangerous failure mode (Part 5, step 13b)
* Publish changelog before confirming artifacts are available
* In Jira-link mode, skip the classification step (Part 1, step 2) — every release issue must be assigned to "customer-facing", "internal", or "unclear"; never silently document everything or silently drop everything
* In Jira-link mode, drop an item from the changelog without surfacing it in the "Skipped (internal)" preview block — the author must be able to spot a misclassification before content disappears
* Pre-filter the JQL query by `docs_required` and treat the result as the full input — the label is a signal, not the gate; classify all release issues explicitly so the result is auditable
* In explicit-list mode, drop or add items relative to what the author provided — document exactly that set, no more and no less
* Invent changes not present in the source items
* Change existing changelog entries unless fixing a factual error
* Modify wrapper files in any `docs/<X>/` directory — wrappers receive their content from `docs/latest/`, so editing them directly creates a version-pinned snapshot that will silently fall behind. Edit `docs/latest/` (the wrapper's target) instead, with the freeze flow if needed
* Bump versions in a `docs/<X>/` directory whose MAJOR does not match the release — e.g., never bump `docs/5.0/` references for a 6.x or 7.x release, never bump `docs/6.x/` references for a 7.x release. Each `docs/<X>/` is scoped to its own version line; cross-line bumps leak the new version statement into the wrong major's docs (Part 0 + Part 4 step 11 — only sweep the in-scope version directories)
* Forget to bump `docs/<NEW-MAJOR>/` for a release on a non-current-root line — when documenting a 7.x release while 6.x is still root, the changelog goes to `docs/latest/.../node-artifact-versions.md`, but any frozen full-content files in `docs/7.x/` that reference the version still need to be bumped, and `docs/6.x/` should not be touched
* Forget to check both x86_64 and ARM64 installer URLs
* Mix up NGINX Node and Native Node changelogs
* Guess on a borderline classification call — flag it as "Unclear" and ask the author. False negatives (silently dropping a user-visible change) are the dangerous failure mode
* Assume that AIO and Helm chart got the same parameters in a release — verify via linked PRs, and if unclear, ask the author for the Helm chart PR or confirmation
* Add a "new config parameter" bullet to a Helm chart changelog entry without confirming the parameter was actually added to `values.yaml`
* Add a new parameter only to its own reference subsection — also add it to the article-level overview/general config example and to any feature-specific example block where it applies
* Write Jira issue keys (e.g., `NODE-7672`) into the changelog or any other published doc — Jira keys are internal cross-references only and never appear in release notes
* List a CVE in the changelog without confirming it via `docker scout compare --only-fixed` between the new and previous versions of the same artifact
* Reuse a single CVE list across all form factors — each artifact (Docker image, Helm chart base image, AIO via Docker proxy, sidecar) gets its own `docker scout compare` run and its own CVE bullet list
* For AIO, list a CVE that scout reports only in OS-level paths (`/usr/lib`, `/lib`, `/var/lib/dpkg/...`) — only `/opt/wallarm`-located fixes belong to AIO; OS-level fixes are the host's responsibility
* Write a CVE/GHSA ID as bare text — every CVE/GHSA in the changelog must be a markdown link to its authoritative advisory page (NVD for `CVE-...`, GitHub Advisories for `GHSA-...`)
* When a Native Node release bumps the NGINX Node base, copy NGINX Node bullets verbatim into the Native Node changelog without a per-bullet applicability check — NGINX-specific fixes (NGINX directives, ingress controller, NGINX module issues) never apply to Native Node
* When a Native Node release bumps the NGINX Node base, document a NGINX Node feature in the Native Node changelog using the NGINX directive name — Native Node parameter names usually differ; ask the author for the actual Native Node parameter name and only document it after confirmation
* Use the NGINX Node CVE list as the Native Node CVE list when bumping the base — always run `docker scout compare` against the Native Node images themselves (Part 2b); the NGINX changelog is a hint, not a source
* Draft changelog text for a component-replacement item before the author has confirmed the old↔new mappings, deprecation policy, and migration path — without those answers the documentation cannot be correct, so pause and ask
* Edit `docs/latest/` with version-specific content before freezing the wrappers in versions that must not receive that content — `docs/latest/` is shared by every version whose wrapper still includes from it, so an edit leaks into all of them by default
* On a major-version bump, touch any structural config — `stylesheets/extra.js` (`rootVersion`), `mkdocs-*.yml` choice of root, `netlify.toml`, `Dockerfile`, version selector partials, or redirects. Those belong to the separate promote-preview-to-root operation. This skill writes the changelog and freezes older versions; the promotion is somebody else's job
* On a major-version bump, forget to tell the author the local serve command for the new MAJOR (e.g., `./serve.sh mkdocs-7.x.yml`) and the URL it will be served at (`http://127.0.0.1:8000/<NEW-MAJOR>.x/` until promotion)
