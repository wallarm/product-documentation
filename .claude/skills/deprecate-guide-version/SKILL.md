---
name: deprecate-guide-version
description: "Remove a deprecated guide version from the documentation site. Deletes version content, updates version selector, netlify.toml, Dockerfile, and adds redirects for the removed version's URLs."
---

# Prompt

You are removing a deprecated documentation guide version from the Wallarm product documentation.

## Input

The author provides:
* **Version to deprecate**: e.g., `5.x`
* **Previous deprecated version** (optional): the version currently in `mkdocs-deprecated.yml` (e.g., `4.10`)

## Steps

### Phase 1: Remove version content

1. **Delete the version's content folder**:
   ```
   rm -rf docs/<DEPRECATED_VERSION>/
   ```

2. **Delete the version's mkdocs config**:
   ```
   rm mkdocs-<DEPRECATED_VERSION>.yml
   ```

3. **Update `mkdocs-deprecated.yml`** to point to the newly deprecated version:
   - Set `extra.version` to the deprecated NGINX Node version
   - Set `extra.versionNative` to the corresponding Native Node version (if applicable)
   - Set `site_dir` to `site/<DEPRECATED_VERSION>`

### Phase 2: Update version selector

4. **Update `stylesheets/partials/nav.html`**:
   - Remove the `<a>` tag for the deprecated version from the `versionsList` div
   - Update the deprecated version `<a>` tag to point to the new deprecated version number:
     ```html
     <a href="" onClick="goToVersion(event, '{{config.extra.version}}', '<DEPRECATED_VERSION>')">Version <DEPRECATED_VERSION> and <NATIVE_VERSION> ⚠️</a>
     ```

5. **Update `stylesheets/extra.js`**:
   - Remove the deprecated version path from the `isHomepage` condition if present

### Phase 3: Update build config

6. **Update `netlify.toml`**:
   - Remove the build command for the deprecated version:
     ```
     cp -R images/ docs/<DEPRECATED_VERSION>/images/ && zensical build -f mkdocs-<DEPRECATED_VERSION>.yml && rm -rf docs/<DEPRECATED_VERSION>/images/ &&
     ```

7. **Update `Dockerfile`**:
   - Remove the `RUN` line for the deprecated version build

### Phase 4: Add redirects

8. **Add redirects in `docs/6.x/_redirects`** (or whichever version serves at root) to redirect all deprecated version URLs to the stub page:

   ```
   /<DEPRECATED_VERSION>/admin-en/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/installation/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/quickstart/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/updating-migrating/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/user-guides/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/about-wallarm/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/attacks-vulns-list/ /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/api/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/api-discovery/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/api-sessions/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/agentic-ai/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/vulnerability-detection/* /<DEPRECATED_VERSION>
   /<DEPRECATED_VERSION>/faq/* /<DEPRECATED_VERSION>
   ```

9. **Add a redirect from the previous deprecated version** to the newly deprecated one if the old stub is being replaced:
   ```
   /<PREVIOUS_DEPRECATED_VERSION>/* /<DEPRECATED_VERSION>
   ```

### Phase 5: Clean up

10. **Check for includes referencing the deleted folder**:
    * Grep for `docs/<DEPRECATED_VERSION>/` across the repo
    * If any files include content from the deleted folder, replace the include with the actual content or update the reference

11. **Check for cross-references to the deprecated version**:
    * Grep for `<DEPRECATED_VERSION>` in remaining docs
    * Remove or update references that point to deprecated version instructions

12. **Update home page descriptions** in remaining versions to reflect the deprecation.

### Phase 6: Verify

13. **Build locally** to verify all remaining versions build correctly:
    ```bash
    ./serve.sh mkdocs-6.x.yml
    ./serve.sh mkdocs-7.x.yml
    ```

14. Check that:
    * Deprecated version no longer appears as an active version in the selector (only with ⚠️ marker)
    * All remaining version builds succeed
    * No broken includes or cross-references remain

## Do NOT

* Delete the `docs/deprecated/` folder — it contains the stub page for all deprecated versions
* Forget to add redirects — this causes 404 errors for users with bookmarked URLs
* Remove version from nav.html without also removing from netlify.toml and Dockerfile
* Delete `mkdocs-deprecated.yml` — only update it to point to the newly deprecated version
