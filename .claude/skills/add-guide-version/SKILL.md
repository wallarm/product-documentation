---
name: add-guide-version
description: "Add a new documentation guide version (e.g., 7.x). Creates version folder, config, wrappers; freezes the previous version's version-specific pages and splits version-specific include snippets; updates version selector, feeds config, netlify.toml, Dockerfile, and home page descriptions."
---

# Prompt

You are adding a new major guide version to the Wallarm product documentation.

## Input

The author provides:
* **New NGINX Node version**: e.g., `7.x`
* **Corresponding Native Node version**: e.g., `0.26.x+`
* **Previous latest version**: the version that was serving at site root before (e.g., `6.x`)
* **What is new**: key changes or a link to the what-is-new page content

## Steps

### Phase 1: Create version directory and config

1. **Copy the previous latest version folder** to create the new one:
   ```
   cp -r docs/<PREVIOUS_VERSION>/ docs/<NEW_VERSION>/
   ```

2. **Clean up images** in the new folder — remove `docs/<NEW_VERSION>/images/` if it exists (it will be populated at build time via `cp -R images/`).

3. **Copy and update the mkdocs config**:
   - Copy `mkdocs-<PREVIOUS_VERSION>.yml` to `mkdocs-<NEW_VERSION>.yml`
   - Update these values in the new config:
     - `extra.version` → new NGINX Node version (e.g., `7.x`)
     - `extra.versionNative` → new Native Node version (e.g., `0.26.x+`)
     - `docs_dir` → `docs/<NEW_VERSION>`
     - `site_dir` → `site/<NEW_VERSION>`

4. **Update the previous version config**:
   - In `mkdocs-<PREVIOUS_VERSION>.yml`, set `site_dir` to `site/<PREVIOUS_VERSION>` (it previously built to `site/` root)

4a. **Register the new version in the changelog feeds config** (`feeds.config.yml`):
   - Add the new folder to `docs_versions` with its `nginx_line` and `url_prefix` (e.g., `{folder: "8.x", nginx_line: "8.x", url_prefix: "/8.x"}`).
   - Add a rule to `nginx_lines` for the new NGINX major (`label` + `url_prefix`); and to `native_lines` if this line starts a new Native train floor.
   - Without this, the new version's releases will not appear in the RSS/JSON feeds, and the feed build fails with `no nginx_lines rule for version <NEW>`.
   - The `subscribe-to-release-updates.md` and `installation/nginx-compatibility.md` pages carry over automatically via the folder copy (Step 1) and config copy (Step 3) — no separate wrapper/nav work needed. (The `url_prefix` flip that happens when this version is promoted to root belongs to the separate promote-preview-to-root operation, not here.)

### Phase 2: Freeze version-specific content in the previous version

Freezing means: a page in `docs/<PREVIOUS_VERSION>/` stops being a one-line wrapper that includes from `docs/latest/` and instead holds the full content as it is valid for the previous version. After this, editing `docs/latest/` for the new version no longer changes the previous version.

**Correctness guard (do this at the RIGHT time).** Freezing copies the *current* `docs/latest/` content. That is only correct while `docs/latest/` still reflects the previous version. So freeze **before** you start editing `docs/latest/` for the new version. If a page was already changed for the new version in `docs/latest/`, do NOT copy the current content — restore the pre-change version from git instead, or (simpler) make sure every page you edit for the new version is frozen first.

5. **Determine the canonical freeze set.** Always freeze:
   - the entire `docs/latest/installation/` tree
   - the entire `docs/latest/updating-migrating/` tree
   - `docs/latest/admin-en/installation-docker-en.md`, `installation-kubernetes-en.md`, `installation-postanalytics-en.md`
   - `docs/latest/admin-en/chaining-wallarm-and-other-ingress-controllers.md`
   - `docs/latest/user-guides/rules/rules.md`
   - any other page that carries version-specific content: node metrics, logging, `configure-kubernetes-en.md`, pages that reference package repos, Docker tags, installer URLs, or node-version-specific behavior.

   **Exclusions:**
   - **New-for-this-version pages** — a page that exists in `docs/latest/` and in the new version's nav but has no counterpart in the previous version's nav (e.g., `admin-en/configure-kubernetes-annotations.md` when adding 7.x). It must stay *absent* from `docs/<PREVIOUS_VERSION>/`. Do NOT create a copy.
   - **Stale paths** — this guide historically listed files that no longer exist (e.g., `admin-en/integration-guides/repo-mirroring/centos/how-to-mirror-repo-artifactory.md`). Skip anything missing from both `docs/latest/` and the previous version's nav.

6. **Freeze each page in place.** For every `docs/<PREVIOUS_VERSION>/` page that is still a wrapper, replace **only** the `--8<-- "latest/<PATH>"` directive line with the verbatim contents of `docs/latest/<PATH>`, keeping everything else in the file (YAML front-matter, `<meta>` tags, link-reference `[key]: ...` headers). This makes the frozen page render identically to how the wrapper rendered.
   - Follow the include's **declared target**, not the mirror path — a wrapper may point to a different latest path than its own location (e.g., `installation/cloud-platforms/aws/ami.md` includes `latest/installation/inline/compute-instances/aws/aws-ami.md`).
   - Touch only files that still contain a `latest/` include. Never rewrite already-frozen files (they have no such include, so they are skipped naturally).
   - Duplicate link-reference definitions (one set from the wrapper header, one from the inlined body) are harmless — the first definition wins, which is the previous-version-correct value.

   A small script is the reliable way to do 100+ files; walk `docs/<PREVIOUS_VERSION>/{installation,updating-migrating}` plus the admin-en set, match `^\s*--8<--\s*"latest/([^"]+)"\s*$`, and substitute the target file's content.

7. **Split version-specific include snippets.** Frozen pages still contain `--8<-- "../include/..."` directives pointing at **shared** snippets. Some snippets carry version-specific content (package versions, repo URLs, Docker tags) and must diverge between versions. Versioning is done by **filename suffix** (`-6.x`, `-5.0`, `-4.4`) — never subfolders; a `-latest` suffix means "tracks the newest version".
   - **Derive the pin set** from precedent: base snippet names that the previous *already-frozen* version pins (have a `-<older>` sibling in `include/`, e.g. `*-5.0.md` / `*-5.x.md`) **intersected with** the snippets referenced by the pages you just froze. Mirror exactly that set — do not pin snippets the older frozen version left shared.
   - For each base in the pin set: create `include/.../<snippet>-<PREVIOUS_VERSION>.md` by copying the content the previous version currently renders (its `-latest` or plain variant — still previous-version-valid before latest diverges). Then rewrite the matching `--8<-- "../include/<snippet>..."` directives across `docs/<PREVIOUS_VERSION>/**` to the pinned `-<PREVIOUS_VERSION>` file. Use exact filename matching so `foo.md` does not also match `foo-reconnect.md`.
   - `docs/latest/` keeps the plain / `-latest` names so those snippets can be freely edited for the new version. Leave genuinely shared `-latest` snippets (ones the older frozen version did NOT pin) untouched.

8. **Verify integrity.** Confirm there are no remaining `--8<-- "latest/..."` directives in the frozen trees, and that **every** `--8<-- "../include/..."` reference under `docs/<PREVIOUS_VERSION>/` resolves to an existing file (zero broken includes).

### Phase 3: Update version selector and platform files

9. **Update `stylesheets/partials/nav.html`**:
   - In the `versionsList` div, add a new `<a>` tag for the new version at the appropriate position:
     ```html
     <a href="" onClick="goToVersion(event, '{{ config.extra.version }}', '<NEW_VERSION>')">Versions <NEW_VERSION> and <NATIVE_VERSION></a>
     ```

10. **Update `stylesheets/extra.js`**:
   - Update `rootVersion` variable if the new version becomes the root version
   - Add the new version path to the `isHomepage` condition if needed:
     ```javascript
     || location.pathname === "/<NEW_VERSION>/"
     ```

11. **Update `netlify.toml`**:
    * Add a new build command for the new version. Place it among the other version build commands:
      ```
      cp -R images/ docs/<NEW_VERSION>/images/ && zensical build -f mkdocs-<NEW_VERSION>.yml && rm -rf docs/<NEW_VERSION>/images/ &&
      ```

12. **Update `Dockerfile`**:
    * Add a new `RUN` line for the version build:
      ```
      RUN cp -R images/ docs/<NEW_VERSION>/images/ && zensical build -f mkdocs-<NEW_VERSION>.yml && rm -rf docs/<NEW_VERSION>/images/
      ```

### Phase 4: Update content

13. **Update home page descriptions** in each version to reflect the new latest version and its key features.

14. **Create the what-is-new page** for the new version if it does not exist:
    * `docs/latest/updating-migrating/what-is-new.md`
    * Add wrapper in `docs/<NEW_VERSION>/updating-migrating/what-is-new.md`
    * Add to nav in `mkdocs-<NEW_VERSION>.yml`

### Phase 5: Verify

15. **Build locally** to verify:
    ```bash
    ./serve.sh mkdocs-<NEW_VERSION>.yml
    ./serve.sh mkdocs-<PREVIOUS_VERSION>.yml
    ```

16. Check that:
    * Navigation renders correctly
    * Version selector shows the new version
    * Pages resolve without 404s
    * Images load correctly
    * Frozen previous-version installation/upgrade pages render full content (not empty) and still show the previous version's package versions, repo URLs, and Docker tags

## Important notes

* The version number in mkdocs config filenames corresponds to the **NGINX Node** major version. The documentation covers both NGINX and Native Node.
* The new version may initially serve under `/<NEW_VERSION>/` (not at root) until it becomes the default.

## Do NOT

* Delete the previous version's content — only freeze it by replacing wrappers with full content
* Freeze from `docs/latest/` **after** it has already been edited for the new version — freeze first, then edit latest (see the correctness guard in Phase 2)
* Create a previous-version copy of a page that is new for this version (exists in latest + new-version nav but not in the previous version's nav) — leave it absent
* Version-split include snippets by subfolder — the convention is a filename suffix (`-6.x`, `-5.0`); and do not pin snippets that the older frozen version left shared
* Leave dangling includes — every `--8<-- "../include/..."` in the frozen version must resolve
* Change `mkdocs-base.yml` — it is shared across all versions
* Forget to update ALL of: nav.html, extra.js, feeds.config.yml, netlify.toml, Dockerfile
* Modify `rootVersion` in extra.js without explicit approval — this controls which version serves at `/`
