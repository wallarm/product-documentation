---
name: add-guide-version
description: "Add a new documentation guide version (e.g., 7.x). Creates version folder, config, wrappers, updates version selector, netlify.toml, Dockerfile, and home page descriptions."
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

### Phase 2: Copy version-specific content

5. **Identify pages with version-specific content** that must be frozen in the previous version. These typically include:
   - Installation and deployment docs (`docs/latest/installation/`, `docs/latest/admin-en/installation-*.md`)
   - Update/migration docs (`docs/latest/updating-migrating/`)
   - Any pages that reference version-specific package repos, Docker tags, or installer URLs

6. **Copy these pages** from `docs/latest/` into `docs/<PREVIOUS_VERSION>/`, replacing the one-line wrapper includes with full content. This freezes the previous version's instructions.

7. **Verify** that the top of each copied file still has any required link references or metadata — the copy should not strip anything.

### Phase 3: Update version selector and platform files

8. **Update `stylesheets/partials/nav.html`**:
   - In the `versionsList` div, add a new `<a>` tag for the new version at the appropriate position:
     ```html
     <a href="" onClick="goToVersion(event, '{{ config.extra.version }}', '<NEW_VERSION>')">Versions <NEW_VERSION> and <NATIVE_VERSION></a>
     ```

9. **Update `stylesheets/extra.js`**:
   - Update `rootVersion` variable if the new version becomes the root version
   - Add the new version path to the `isHomepage` condition if needed:
     ```javascript
     || location.pathname === "/<NEW_VERSION>/"
     ```

10. **Update `netlify.toml`**:
    * Add a new build command for the new version. Place it among the other version build commands:
      ```
      cp -R images/ docs/<NEW_VERSION>/images/ && zensical build -f mkdocs-<NEW_VERSION>.yml && rm -rf docs/<NEW_VERSION>/images/ &&
      ```

11. **Update `Dockerfile`**:
    * Add a new `RUN` line for the version build:
      ```
      RUN cp -R images/ docs/<NEW_VERSION>/images/ && zensical build -f mkdocs-<NEW_VERSION>.yml && rm -rf docs/<NEW_VERSION>/images/
      ```

### Phase 4: Update content

12. **Update home page descriptions** in each version to reflect the new latest version and its key features.

13. **Create the what-is-new page** for the new version if it does not exist:
    * `docs/latest/updating-migrating/what-is-new.md`
    * Add wrapper in `docs/<NEW_VERSION>/updating-migrating/what-is-new.md`
    * Add to nav in `mkdocs-<NEW_VERSION>.yml`

### Phase 5: Verify

14. **Build locally** to verify:
    ```bash
    ./serve.sh mkdocs-<NEW_VERSION>.yml
    ```

15. Check that:
    * Navigation renders correctly
    * Version selector shows the new version
    * Pages resolve without 404s
    * Images load correctly

## Important notes

* The version number in mkdocs config filenames corresponds to the **NGINX Node** major version. The documentation covers both NGINX and Native Node.
* The new version may initially serve under `/<NEW_VERSION>/` (not at root) until it becomes the default.
* Translation configs (`mkdocs-ja-*.yml`, etc.) may also need new version configs — check with the author.

## Do NOT

* Delete the previous version's content — only freeze it by replacing wrappers with full content
* Change `mkdocs-base.yml` — it is shared across all versions
* Forget to update ALL of: nav.html, extra.js, netlify.toml, Dockerfile
* Modify `rootVersion` in extra.js without explicit approval — this controls which version serves at `/`
