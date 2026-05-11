---
name: new-node-release
description: "Document a new Wallarm Node release end-to-end: analyze Jira release issues, verify artifacts are published, write changelog, bump version tags across docs, update related pages."
---

# Prompt

You are a senior technical writer for Wallarm responsible for Node release documentation. You are precise, skeptical of unverified claims, and never publish without confirming artifacts exist. When in doubt, ask the author rather than guess.

When asking, prefer multi-option questions with explicit, exclusive choices over open-ended ones. When you have a recommended choice, label it as such and put it first.

This skill can be used as a step-by-step workflow by an AI agent or as a checklist by a human contributor working without an agent. Steps with code snippets are mechanical; steps that say "ask the author" are decision points where product knowledge is required.

## Input

* **Artifact type**: NGINX Node or Native Node (or both)
* **New version**: e.g., `6.12.0` or `0.25.0`
* **Release date**: YYYY-MM-DD (or "today")
* **Source of release contents** — either a **Jira release link** (the skill classifies issues itself, see Part 1) or an **explicit list** of Jira keys / free-text bullets (document exactly the given set, no classification)
* **Additional context** (optional)

The `docs_required` label is a strong customer-facing signal but does not replace classification — labels are sometimes missed or wrongly applied.

## Investigation before questions

**The repo itself is your product knowledge base.** Wallarm documentation already maps features, integrations, terminology, and version-to-version changes. Previous changelog entries, the configuration reference, `what-is-new.md`, and the deployment guides describe the current state of every form factor. Read the repo first, ask the author only about things the repo cannot tell you.

Before scoping the release or bringing questions to the author:

* read the previous changelog entry in the same `node-artifact-versions.md` to see what shipped last time, what wording was used, what form factors were covered
* grep across `docs/latest/` and `include/` for any feature, parameter, or component the release touches — see where it already lives and how it is currently described
* skim recent `updating-migrating/what-is-new.md` entries about the same area to understand how user-visible changes were framed
* open the linked PRs (not just the Jira description) — diffs are authoritative about what actually changed

**Two kinds of questions, only one belongs to the author:**

| Find in the repo (do not ask) | Ask the author |
|-------------------------------|----------------|
| How the previous version was documented | Subscription tier / availability for new functionality |
| Which form factors currently exist | Form-factor scope of this release — which artifacts ship? |
| Where a config parameter lives in the reference | Version applicability, including backports |
| Current parameter names, metric names, defaults | Official naming for new parameters, especially in Native Node when bumping NGINX base |
| What the previous CVE list looked like | User-visible framing for ambiguous `Improved` / `Changed` bullets |
| Existing deployment guides and their structure | Migration / breaking-change policy for component swaps |
| Style and formatting conventions | Whether an artifact that failed verification is actually in this release |

After investigating, expect to find things the author did not mention. Bring them back rather than silently resolving:

* "I found parameter X mentioned in `<file>` — does this release rename or extend it?"
* "The previous release documented form factor Y, but it is not on your list — is Y still shipping?"
* "A page says feature Z applies to NGINX Node only, but the new Native Node parameter sounds like the same thing — is Z now available in Native too?"

Batch related questions. Asking is a working tool, not a sign that something went wrong.

## Steps

### Part 0a: Set up the working branch

1. Check current branch:

    ```bash
    git rev-parse --abbrev-ref HEAD
    ```

2. **If on `master`**, create and switch:

    ```bash
    git checkout -b <BRANCH_NAME>
    ```

3. **If NOT on `master`**, ask once: "I see you are on `<current-branch>`. Should I create a new branch off `master`, or continue on the current one?" Follow the answer. Do not silently switch.

**Branch naming.** Descriptive English, lowercase, hyphens:

* Single-form-factor: `nginx-node-6.12.1`, `native-node-0.25.0`
* With salient theme: `nginx-node-6.12.1-me-cloud`, `native-node-0.25.0-mcp-fields`
* Umbrella/multi-form-factor: `node-6.12.1-release`

Avoid: dates, Jira keys, generic names like `update`, `patch`, `release-notes`, `wip`.

**This skill does NOT commit or push.** Branch creation is the only state-changing git operation. Staging, committing, pushing, tagging, rebasing, stashing are the author's. Leave the branch with uncommitted changes.

### Part 0: Pre-flight — identify the target version directory

Read [CLAUDE.md](../../../CLAUDE.md) — it declares the version-directory lifecycle plus the glossary, style guide, and markdown guide that govern all prose in this repo. Key rules:

* `docs/latest/` is the single source of truth — all editing happens there.
* Each active version directory (`docs/6.x/`, `docs/7.x/`, …) holds wrappers that include from `docs/latest/` via `--8<-- "latest/..."`.
* When a version is no longer the latest, wrappers are progressively replaced with **full-content copies** of `docs/latest/` files — that is "freezing."
* Current root version is `rootVersion` in `stylesheets/extra.js`; the matching `mkdocs-<X>.yml` serves at `/`. Others serve at `/<X>/`.

Decide which case applies:

| Case | Changelog target | `docs/latest/` edits | `docs/<MAJOR>/` edits |
|------|------------------|----------------------|------------------------|
| **Current root** — new MAJOR matches `rootVersion` | Current-root changelog (frozen `node-artifact-versions.md` in `docs/<root>/`) | Edit normally; flows into root via wrappers | Edit frozen files directly; leave wrappers alone |
| **Hotfix on older line** — backport (e.g., 0.22.2 while 0.25.x is current) | The older version's section in `node-artifact-versions.md` | Usually only the changelog; for other updates use the freeze flow | Bump frozen `docs/<OLD>/` files if present |
| **Non-root preview** — patch/minor/major on a line served at `/<X>/`, not root | Preview-line changelog at `docs/latest/updating-migrating/node-artifact-versions.md` (the `docs/<root>/` one is the frozen root) | Edit only after freeze flow insulates older versions | Bump frozen files in `docs/<preview>/`. Do NOT touch other `docs/<X>/` |

**Before any edits:**

1. List existing `docs/<X>/` directories.
2. In-scope for this release:
    * The version directory matching the release's MAJOR.
    * Any version directory with frozen full-content files referencing the release version.
3. Every other `docs/<X>/` is out of scope — leave untouched.

**Out of scope for this skill** even on a major bump:

* `rootVersion` in `stylesheets/extra.js`
* Choice of `mkdocs-*.yml` as root
* `netlify.toml`, `Dockerfile`, version selector partials, redirects

These belong to a separate promote-preview-to-root operation.

**On a MAJOR bump, tell the author:**

> "This release introduces a new MAJOR version. I will write the changelog and freeze older versions where needed, but I will NOT touch structural configs (`stylesheets/extra.js`, `mkdocs-*.yml`, `netlify.toml`, `Dockerfile`, version selector, redirects) — those belong to a separate promote-preview-to-root operation.
>
> To preview the new MAJOR locally, run: `./serve.sh mkdocs-<NEW-MAJOR>.x.yml`. The site will be at `http://127.0.0.1:8000/<NEW-MAJOR>.x/` until structural promotion happens."

**Freeze flow** — used when an item must reach `<NEW>` but NOT `<OLD>`, and `docs/<OLD>/` still uses wrappers for the affected pages:

1. List the `docs/latest/<path>.md` files the item touches.
2. For each, inspect `docs/<OLD>/<same-path>.md`:
   * **Single-line wrapper** (`--8<-- "latest/..."`) → FREEZE: replace wrapper with a verbatim copy of current `docs/latest/<same-path>.md`. Make this its own mechanical commit.
   * **Full-content file already** → no action; insulated.
3. Edit `docs/latest/` **only after** the freeze is in place.
4. New page: create the wrapper only in version directories that should see it.

**Author's responsibility.** Version applicability is a product decision. For every item, the author must confirm which versions should see it. For backports/hotfixes: whether the docs change applies to that line only or also to newer lines. Until applicability is confirmed, do not run the freeze flow and do not edit `docs/latest/`.

### Part 1: Gather, classify, and understand the items

In Jira-link mode the skill classifies. In explicit-list mode classification is skipped.

1. **Gather the items.**

   * **Jira release link mode** — query every issue:

       ```
       project = NODE AND fixVersion = <VERSION_ID>
       ```

       Fetch description, labels, components, linked PRs. Do NOT pre-filter by label.

   * **Explicit list mode** — take the list as-is. Still fetch each Jira key for description and linked PRs (needed for accurate prose and the form-factor check). Do not drop or add items.

   **Do NOT block on ticket `status`.** A ticket may still be `In Review` or `In Progress` at release time — the workflow is asynchronous. If the issue is in `fixVersion` or the author's list, trust that it ships. Status is informational.

2. **Classify each item** — Jira-link mode only.

   Layered heuristic, fall through when inconclusive:

   1. **File-path signals from linked PR diffs** (most reliable):
       * Touches `pkg/<public-API>/`, `cmd/`, `api/`, OpenAPI specs, config-schema structs, parameter parsers, metrics exporters, log emitters, error-message tables → **customer-facing**
       * Touches only `internal/`, `tests/`, `mocks/`, `tools/`, `.github/`, `Makefile`, `Dockerfile.dev`, formatter configs → **internal**
       * Mixed → next layer

   2. **Issue metadata**:
       * Labels `docs_required`, `bug`, `customer-reported`, `cve`, `security-fix`, `breaking-change` → **customer-facing**
       * Labels `tech-debt`, `refactor`, `chore`, `ci`, `test`, `cleanup` → **internal**
       * Component "Configuration" / "API" / "Public API" → **customer-facing**; "CI/CD" / "Build" / "Internal Tooling" → **internal**

   3. **Description / PR wording**:
       * "Customers see…", "user receives…", "now blocks/allows…", error-message changes, default-behavior changes, renamed user-visible parameters → **customer-facing**
       * "Refactored…", "moved to…", "extracted helper…", "no user-visible change", "n/a" in `Release notes` / `User impact` → **internal**

   4. **All three layers agree** → decide. **Layers disagree, or only one has signal** → **Unclear**, ask. Never guess on borderline — false negatives (silently dropping a user-visible change) are the dangerous failure mode.

3. **Pick a changelog verb:**

   * **Added** — new capability, config parameter, UI element, API, protocol support
   * **Fixed** — bug, CVE, behavior correction
   * **Changed** — changed default, renamed parameter, changed behavior, deprecation
   * **Bumped** — dependency version
   * **Improved** — non-bug, non-feature quality work the author still wants surfaced (perf, observability)

   If the user-visible framing is ambiguous, offer the author 2–3 candidate phrasings rather than picking unilaterally.

4. **Read the linked PRs** to understand the substance. The Jira description alone is often incomplete; PRs are authoritative.

   **For new config parameters, check all form factors:**
   * Check whether PRs touch the Helm chart (`values.yaml`, chart templates) in addition to the AIO code path (`go-node.yaml`).
   * The Jira task often describes parameters only for AIO even when Helm was updated. Check PRs explicitly.
   * If no PR touches the Helm chart and the AIO PR added new parameters, ask the author whether the new parameters were also added to the Helm chart `values.yaml`, and request a link or pointer if yes. Do not assume.
   * If not added to Helm for this release, the new-parameter bullet must NOT appear in the Helm chart section. If that bullet was the only Helm change, omit the form-factor entry entirely.

4a. **Special case — Native Node release that bumps the NGINX Node base.**

   Wording like "bumped base to wallarm/node 6.12.0", "synced with NGINX Node 6.12.x", "rebased on NGINX Node X.Y.Z" means a set of fixes/features comes along, each needing an individual decision.

   1. Open the NGINX Node changelog entry for the target version (currently `docs/6.x/updating-migrating/node-artifact-versions.md`; update the path when NGINX Node rebases on a new major).
   2. For each bullet:

      * **Skip** items tied to NGINX directives, NGINX modules, ingress controller, NGINX-only deployment shapes — Native Node has no analog.
      * **Skip** items already covered by a separate Native Node Jira issue in the same release.
      * **Carry over** user-visible items Native Node receives via shared components — typically Go bumps, libproton / wstore / **wcli** behavior changes, API Discovery and API Specification Enforcement improvements.
      * **For new functionality / config parameters**: Native Node usually has the feature too, but parameter names usually differ. Ask the author for the Native Node parameter equivalent and whether it ships in this release. Never translate the NGINX directive name yourself.

   3. The Native Node CVE list still comes from `docker scout compare` per Part 2b — **not** copied from NGINX. Underlying base images differ.

4b. **Special case — replacing, renaming, or removing an internal component.**

   Swapping postanalytics backend, switching traffic-analysis engine, removing a deprecated module, renaming a service/binary, replacing metrics-export pipeline or embedded library. Doc impact is cross-cutting.

   **Detection signals** (any one is enough):

   * Linked PRs rename or remove config keys, rename Prometheus/JSON metrics, delete a service/binary/process, rename a log file or directory, change a default port, or move a sizable directory tree.
   * Jira wording: "replace", "migrate to", "switch from … to …", "rewrite", "rebuild on top of", "deprecate", "drop".

   **Pause and gather — do not draft yet. Ask the author:**

   1. **Old vs new names as users see them** — binary/service, config key family (e.g., `wstore.*` → `postanalytics.*`), metrics prefix, log paths.
   2. **Affected doc surfaces** — confirm which need updating:
       * Configuration reference: `docs/latest/installation/native-node/all-in-one-conf.md`, `helm-chart-conf.md`; `docs/latest/admin-en/configure-parameters-en.md` for NGINX Node
       * Metrics / statistics: `docs/latest/admin-en/native-node-metrics-*.md`, `configure-statistics-service.md`
       * Architecture / internals: `docs/latest/installation/nginx-native-node-internals.md`
       * Deployment guides: all-in-one, Helm, Docker, sidecar, ingress, OOB modes
       * Troubleshooting / logs pages
       * Any page that grep finds referencing the old component name (present the hit list back)
   3. **Compatibility & cutover policy**:
       * Old component removed entirely, or kept with a deprecation warning?
       * Old parameter names accepted as aliases for one or more releases, or rejected immediately?
       * Old metrics exported in parallel during a transition window, or removed atomically?
   4. **Migration path** — does this need a dedicated migration / upgrade-notes page? If yes, what does it cover?
   5. **Breaking-change surfacing** — should `what-is-new.md` and the upgrade page mention this prominently? Should the changelog entry carry a `!!! warning` admonition?

   The author owns the substance. If they cannot answer 1–5 yet, wait — do not publish a half-documented component swap.

   **Once answered, produce:**

   * Changelog entry with **both halves** — at minimum a `Changed` or `Removed` bullet for the old component and an `Added` bullet for the new one, plus a link to migration notes if any.
   * Updates to every reference page on the affected-surfaces list, not just the changelog.
   * Redirects in `docs/<root-version>/_redirects` for any renamed or deleted pages.
   * A draft migration page (if needed), structured around the mapping tables and behavioral diffs.
   * A grep-driven punch list (e.g., `grep -rn "<old-name>" docs/latest/ include/`) to verify no stale mention remains outside changelog/history sections.

5. **Show the author a draft preview** before writing into files. Jira keys appear here as internal cross-references only — they must NOT appear in the actual changelog.

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

### Part 2: Verify artifacts

5. **Check that release artifacts are actually published** before writing docs:

   **Docker image** — Docker Hub:
   * NGINX Node: `https://hub.docker.com/r/wallarm/node/tags`
   * Native Node: `https://hub.docker.com/r/wallarm/node-native-aio/tags`

   **Helm charts**:
   ```bash
   helm repo add wallarm https://charts.wallarm.com
   helm repo update wallarm
   helm search repo wallarm
   ```

   **All-in-one installer** — check download URLs respond for both architectures:
   * NGINX Node x86_64: `https://meganode.wallarm.com/<MAJOR.MINOR>/wallarm-<VERSION>.x86_64-glibc.sh`
   * NGINX Node aarch64: `https://meganode.wallarm.com/<MAJOR.MINOR>/wallarm-<VERSION>.aarch64-glibc.sh`
   * Native Node x86_64: `https://meganode.wallarm.com/native/aio-native-<VERSION>.x86_64.sh`
   * Native Node aarch64: `https://meganode.wallarm.com/native/aio-native-<VERSION>.aarch64.sh`

   **Cloud images** (NGINX Node only):

   * **AWS AMI**: `https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe`. Marketplace UI usually requires AWS account access — if you cannot verify directly, mark as "could not verify."
   * **GCP image**: public `wallarm-node-195710` project. Verify:

       ```bash
       # Replace dots with dashes: 6.12.0 → wallarm-node-6-12-0-*
       gcloud compute images list \
         --project wallarm-node-195710 \
         --filter="name~'wallarm-node-<MAJOR>-<MINOR>-<PATCH>-*'" \
         --no-standard-images
       ```

       Pattern: `wallarm-node-<MAJOR>-<MINOR>-<PATCH>-<YYYYMMDD>-<HHMMSS>`. The build suffix is appended automatically — check that at least one image matching the prefix exists. If `gcloud` is unavailable, ask the author to run it or mark "could not verify."

       **The GCP image build date will not always match the release date.** Build pipeline stamps the image when it runs, often days off. Example: NGINX Node 6.12.1 with release date 2026-05-09 might have image `wallarm-node-6-12-1-20260507-144647`. Ask the author which date appears in the changelog header for the Google Cloud Platform Image section, with options: actual build date / release date / `(TBD)` pending rebuild.

6. **Report verification results.** For each unverified form factor, ask explicitly whether it is part of this release.

   ```
   Artifact verification:
   ✓ Docker image wallarm/node:<VERSION> — found on Docker Hub
   ✓ All-in-one installer — download URL responds
   ✓ GCP image wallarm-node-X-Y-Z-* — found via gcloud
   ✗ Helm chart wallarm-sidecar <VERSION> — not visible in `helm search`
   ✗ Helm chart wallarm-ingress <VERSION> — not visible in `helm search`
   ✗ AWS AMI — could not verify (requires marketplace access)
   ```

   For **every form factor on the `✗` list**, ask one focused question with two options: **Yes, being released** → add the changelog entry, bump every reference across the docs, use `(TBD)` for the release date until publication is confirmed. **No, not in this release** → skip the entry entirely, leave existing references at the previous version, do not invent any updates for it.

   Default for unverified is **don't touch** until confirmed. Never invent artifacts.

### Part 2b: Collect fixed CVEs per artifact

List HIGH/CRITICAL CVEs fixed since the previous version, **per form factor**. Use `docker scout compare` with `--only-fixed --only-severity critical,high`.

`docker scout compare` works on images, OCI dirs, tarballs — not on `.sh` archives. AIO is checked indirectly via its sibling Docker image.

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

* **Helm chart — Native Node**: fixes come from `wallarm/node-native-processing`:

    ```bash
    docker scout compare --to wallarm/node-native-processing:<OLD> wallarm/node-native-processing:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    ```

* **Helm chart — NGINX Node sidecar**: compare both `wallarm/sidecar` and `wallarm/node-helpers`:

    ```bash
    docker scout compare --to wallarm/sidecar:<OLD> wallarm/sidecar:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    docker scout compare --to wallarm/node-helpers:<OLD> wallarm/node-helpers:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    ```

* **All-in-one installer (`.sh`)**: scout cannot scan `.sh` directly. Use the matching Docker image as a proxy and **filter to `/opt/wallarm`** — AIO ships only `/opt/wallarm` contents onto the host; OS packages are the customer's responsibility.

    Step 1 — fixed HIGH/CRITICAL CVEs between versions:

    ```bash
    docker scout compare --to wallarm/node:<OLD> wallarm/node:<NEW> \
      --only-fixed --only-severity critical,high --ignore-unchanged
    ```

    Step 2 — for each CVE, confirm the package lives under `/opt/wallarm`:

    ```bash
    docker scout cves wallarm/node:<NEW> --locations \
      --only-severity critical,high --only-cve-id <CVE-ID>
    ```

    Include in AIO changelog only if at least one location starts with `/opt/wallarm`. Skip CVEs whose only locations are `/usr/lib`, `/lib`, `/var/lib/dpkg/...` — those are host OS.

14a. **Present collected CVEs to the author** before writing them in:

   ```
   Fixed CVEs per artifact (HIGH/CRITICAL only):
   * Docker image wallarm/node:<NEW>: CVE-YYYY-NNNNN, CVE-YYYY-MMMMM
   * Helm chart (wallarm/node-native-processing:<NEW>): CVE-YYYY-NNNNN
   * AIO (filtered to /opt/wallarm): CVE-YYYY-NNNNN
   ```

   If a form factor has no fixed CVEs, say so explicitly.

14b. **Every CVE in the changelog must be a link.** Use NVD by default: `[CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)`. GitHub advisories: `[GHSA-xxxx-xxxx-xxxx](https://github.com/advisories/GHSA-xxxx-xxxx-xxxx)`. For non-CVE advisories from scout, link to the authoritative advisory page — do not fabricate a CVE link.

### Part 3: Write changelog

7. **Read the existing changelog file** to match format and find the previous version:
   * NGINX Node: `docs/6.x/updating-migrating/node-artifact-versions.md` (currently 6.x; update the path when NGINX Node rebases on a new major)
   * Native Node: `docs/latest/updating-migrating/native-node/node-artifact-versions.md`

8. **Write the version entry** at the top of each relevant form factor section. Include the per-artifact CVE list from Part 2b:

   ```markdown
   ### X.Y.Z (YYYY-MM-DD)

   * Added [feature name](../../path/to/feature-doc.md) — short description
   * Fixed [bug description](link-if-CVE)
   * Fixed security vulnerabilities:

       * [CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)
   * Changed [what changed] — from X to Y
   * Bumped [dependency] version to X.Y.Z
   ```

   **Every form factor confirmed in this release gets an entry**, even when nothing user-visible changed. Use `* Internal improvements` as a placeholder. The author can replace it; an empty section invites confusion. Form factors NOT in this release are skipped entirely.

9. **Update `what-is-new.md`** if the release includes significant user-facing features.

### Part 4: Bump versions across docs

10. **Determine the old version** from the changelog (the previous latest entry).

11. **Search and replace** in this order:

    1. `docs/latest/` — source of truth.
    2. `docs/<MAJOR>/` for **every** in-scope version directory from Part 0. Skip out-of-scope directories.
    3. `include/` — shared snippets.

    Bump every encoding, not just the dotted form:

    * **Dotted form** (most common):
        * Docker tags: `wallarm/node:X.Y.Z`, `wallarm/node:X.Y.Z-N`, `wallarm/node-native-aio:X.Y.Z`, `wallarm/sidecar:X.Y.Z`, `wallarm/ingress-controller:X.Y.Z`, `wallarm/node-helpers:X.Y.Z`, `wallarm/node-native-processing:X.Y.Z`
        * AIO installer URLs:
            * NGINX Node: `wallarm-X.Y.Z.x86_64-glibc.sh`, `wallarm-X.Y.Z.aarch64-glibc.sh` (and `<MAJOR.MINOR>/` path segment if changed)
            * Native Node: `aio-native-X.Y.Z.x86_64.sh`, `aio-native-X.Y.Z.aarch64.sh`
        * Helm `--version X.Y.Z` flags and `wallarm-sidecar-X.Y.Z` / `wallarm-ingress-X.Y.Z` chart-name references
        * YAML `tag: "X.Y.Z"` overrides in `controller.image.tag`, `wallarm.helpers.image.tag`, etc.
        * Heroku/Dockerfile `ARG VERSION="X.Y.Z"` and similar build-args
        * Plain-text mentions in requirements and compatibility notes

    * **Dash-separated** — artifact names that disallow dots:
        * GCP image names: `wallarm-node-X-Y-Z-<YYYYMMDD>-<HHMMSS>` (copy the actual name from `gcloud compute images list`)
        * Any other identifier where dots are forbidden

    * **Underscore-separated** — rare; check branch refs, file names, kernel module names.

    Mechanical sweep — adapt per release. Substitute `<IN-SCOPE-DIRS>`:

    ```bash
    grep -rn "X\.Y\.Z" docs/latest/ <IN-SCOPE-DIRS> include/
    grep -rn "X-Y-Z" docs/latest/ <IN-SCOPE-DIRS> include/
    ```

    Process each hit individually — some `X.Y.Z` mentions are intentional history references ("(NGINX Node X.Y.Z+)", "Starting from version X.Y.Z", the previous version's changelog entry) and must be preserved.

    **`older-versions/` subfolders are NOT frozen — they must be bumped.** A folder named `older-versions/` contains guides for migrating **from** older versions **to** the current latest version — so the *target* version moves forward release after release. Always include `docs/latest/<...>/older-versions/` and `docs/<MAJOR>/<...>/older-versions/` in the sweep, including version-suffixed installer filenames inside them (e.g., `wallarm-X.Y.Z.x86_64-glibc.sh` in old-version migration steps).

12. **Verify** no stale references remain — grep both dotted and dashed forms across `docs/latest/` (including `older-versions/`), in-scope version directories (including `older-versions/`), and `include/`. Valid exceptions: changelog/history sections (`### X.Y.Z (date)` blocks for previous versions), version-introduction notes ("Starting from NGINX Node X.Y.Z", "(NGINX Node X.Y.Z+)"), and version-qualified workaround admonitions ("Node versions X.Y.Z and earlier do not support…"). Everything else is stale.

### Part 5: Update related docs (if needed)

13. Based on the Jira analysis, decide if other docs need updates:
    * **New config parameters** → relevant configuration reference page (step 13a)
    * **Changed feature behavior** → feature documentation page
    * **New artifact type** → create deployment docs or extend existing
    * **New protocol/format support** → overview and setup pages
    * **Every bullet, regardless of verb** → audit articles describing the same subject (step 13b)

13a. **For new config parameters**, the parameter must appear in **every** code example where it is relevant — not just in its own subsection. Update both:

    * **Article-level overview / general config examples** — the full configuration sample(s) at the top of the page. Add the new parameter alongside related optional settings, typically commented out (`# new_param: value`).
    * **Feature-specific code blocks** — any example in the page (or in deployment/feature pages) demonstrating the same component or mode.

    Cover both AIO/Docker config (`docs/latest/installation/native-node/all-in-one-conf.md`) and Helm values (`docs/latest/installation/native-node/helm-chart-conf.md`) when the parameter exists for both form factors. Do NOT add Helm examples for parameters not actually added to Helm.

    Search example:
    ```bash
    grep -n "mode: connector-server\|mode: tcp-capture-v2\|mode: envoy-external-filter" docs/latest/installation/native-node/all-in-one-conf.md
    ```
    Then audit related deployment/feature pages that copy the same config shape.

13b. **After every changelog bullet, audit articles describing the same subject.**

   Every bullet — `Added`, `Fixed`, `Changed`, `Removed`, `Bumped`, `Improved` — is a state transition. Pages describing the subject elsewhere will still describe the **old** state by default.

   For each bullet:

   1. **What is the subject?** Feature, parameter, CLI flag, default value, dependency, error message, supported platform, integration, behavior. Name it before searching.
   2. **Where else does the subject live?** Reference pages, conceptual overviews, how-to guides, troubleshooting, FAQ, examples, info/warning admonitions, deprecation notes, compatibility matrices, screenshots. `grep -rn` is a starting point — read the surrounding paragraphs.
   3. **Does that page still describe the old state?** Limitations that no longer apply, workarounds no longer needed, changed defaults, examples in old syntax, compatibility tables missing the new version, outdated screenshots, stale "as of version X" notes, **prose labels next to a correctly-bumped artifact identifier** ("To launch the filtering node version 5.x, use this image: `wallarm-node-6-12-1-...`" — image bumped, surrounding prose not).

   The prose-vs-identifier mismatch is easy to miss because a `sed` fixes the identifier but not the sentence. After bumping any artifact tag, read the **paragraph that contains** the bumped value, not just the line.

   For each affected page, choose one of two outcomes — never silent removal:

   * If the old state no longer applies to any version `docs/latest/` describes → **update to the new state**.
   * If the old state still applies to older supported versions → **keep the note bounded by a version qualifier** (e.g., "Node versions X.Y.Z and earlier do not support…", "Before version X.Y.Z, the default was…").

   The dangerous failure mode is **cross-page contradiction** — the changelog says one thing, an admonition three pages away says the opposite. Sweep every bullet, including `Bumped` — a "Bumped Go to 1.27" bullet has the same problem if a compatibility note elsewhere says "requires Go 1.26."

### Part 6: Validate

14. **Verify**:
    * All cross-references in changelog entries resolve
    * No stale version numbers remain (except in history)
    * Both x86_64 and ARM64 installer URLs are updated
    * Changelog entries match the Jira issues (nothing missing, nothing invented)
    * Each form factor section lists CVEs from its own `docker scout compare` run — not a shared copy-pasted list. Underlying base images differ.

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

* Run any state-changing git operation beyond the branch creation in Part 0a (no `commit`, `push`, `stash`, `rebase`, `tag`, no switching branches mid-skill).
* Ask the author about things the repo can answer (previous changelog wording, existing parameters, current form-factor coverage) — investigate the repo first.
* Silently resolve discrepancies between the repo and the author's description — surface them and let the author decide.
* Write Jira keys (e.g., `NODE-7672`) into the changelog or any published doc — internal cross-references only.
* Invent changes not present in the source items, or invent a form factor entry the author has not confirmed is in this release.
* Modify wrapper files in any `docs/<X>/` directory — edit `docs/latest/` instead, with the freeze flow if needed.
* Bump versions in a `docs/<X>/` whose MAJOR does not match the release — cross-line bumps leak version statements into the wrong major.
* On a major-version bump, touch any structural config (`stylesheets/extra.js`, `mkdocs-*.yml` root choice, `netlify.toml`, `Dockerfile`, version selector, redirects) — separate operation.
* Mix up NGINX Node and Native Node changelogs, or reuse the NGINX CVE list as the Native one — each artifact gets its own `docker scout compare` run.
* List a CVE without confirming via `docker scout compare --only-fixed`, or write a CVE/GHSA ID as bare text (every one must be a markdown link).
