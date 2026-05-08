---
name: new-node-release
description: "Document a new Wallarm Node release end-to-end: analyze Jira release issues, verify artifacts are published, write changelog, bump version tags across docs, update related pages."
---

# Prompt

You are documenting a new Wallarm Node release. The full workflow is: analyze the Jira release → verify artifacts → write changelog → bump versions → update related docs.

## Input

The author provides:
* **Jira release link**: e.g., `https://wallarm.atlassian.net/projects/NODE/versions/49823/tab/release-report-all-issues`
* **Artifact type**: NGINX Node or Native Node (or both if the release covers both)
* **New version**: e.g., `6.12.0` or `0.25.0`
* **Release date**: YYYY-MM-DD (or "today")
* **Additional context** (optional): anything the author wants to highlight or exclude

## Steps

### Part 1: Analyze Jira release

1. **Fetch all issues** from the Jira release using the fixVersion JQL query.

2. **Categorize each issue** by customer impact:

   | Category | Criteria | Goes into changelog? |
   |----------|----------|---------------------|
   | **Customer-facing feature** | New capability, new UI element, new API, new config parameter, new protocol support | Yes — as "Added" |
   | **Customer-facing fix** | Bug that affected customers, CVE fix, behavior correction | Yes — as "Fixed" |
   | **Customer-facing change** | Changed defaults, renamed parameters, changed behavior, deprecated feature | Yes — as "Changed" |
   | **Internal** | Refactoring, CI/CD, internal tooling, test infrastructure | No — skip |
   | **Unclear** | Cannot determine from issue title/description alone | Ask the author |

3. **Read linked PRs** in each customer-facing issue to understand the actual change (what was added/fixed/changed, which config parameters, which endpoints).

   **For issues that add new config parameters**, also determine whether the change covers all form factors:
   * Look at the linked PRs and check whether they touch the Helm chart (`values.yaml`, chart templates) in addition to the AIO code path.
   * The Jira task itself often describes parameters only for the AIO installer and does not mention Helm chart values, even when the Helm chart was updated in the same PR set. So always check the PRs explicitly.
   * If there is no PR for the Helm chart and the AIO PR added new parameters, **ask the author**: "Were the new parameters also added to the Helm chart `values.yaml`? If yes, please share a link or describe where to look." Do not assume.
   * If the new parameters were **not** added to the Helm chart for this release, the changelog bullet about new parameters must NOT appear in the Helm chart section. If that bullet was the only change for that form factor, omit the form-factor entry entirely for this version.

4. **Present the categorized list** to the author for confirmation before proceeding. Format:

   ```
   Customer-facing changes for changelog:
   * Added: [NODE-XXXX] feature description
   * Fixed: [NODE-YYYY] bug description
   * Changed: [NODE-ZZZZ] change description

   Skipped (internal):
   * [NODE-AAAA] internal refactoring description

   Unclear — please confirm:
   * [NODE-BBBB] issue title — customer-facing or internal?
   ```

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

   **All-in-one installer** — check that download URL responds:
   * NGINX Node: `https://meganode.wallarm.com/aio-<VERSION>.x86_64.sh`
   * Native Node: `https://meganode.wallarm.com/native/aio-native-<VERSION>.x86_64.sh`

   **Cloud images** (if applicable):
   * AWS AMI: `https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe`
   * GCP Image: check docs page for version list

6. **Report verification results** to the author:
   ```
   Artifact verification:
   ✓ Docker image wallarm/node:<VERSION> — found on Docker Hub
   ✓ Helm chart wallarm-node <VERSION> — found
   ✓ All-in-one installer — download URL responds
   ✗ AWS AMI — could not verify (requires marketplace access)
   ```

   If any critical artifact is missing, warn the author and do NOT proceed with publishing docs until confirmed.

### Part 3: Write changelog

7. **Read the existing changelog file** to match format and determine the old version:
   * NGINX Node: `docs/6.x/updating-migrating/node-artifact-versions.md`
   * Native Node: `docs/latest/updating-migrating/native-node/node-artifact-versions.md`

8. **Write the version entry** at the top of each relevant form factor section:

   ```markdown
   ### X.Y.Z (YYYY-MM-DD)

   * Added [feature name](../../path/to/feature-doc.md) — short description
   * Fixed [bug description](link-if-CVE)
   * Fixed security vulnerabilities:

       * [CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)
   * Changed [what changed] — from X to Y
   * Bumped [dependency] version to X.Y.Z
   ```

9. **Update `what-is-new.md`** if the release includes significant user-facing features.

### Part 4: Bump versions across docs

10. **Determine the old version** from the changelog (the previous latest entry).

11. **Search and replace** the old version in `docs/latest/` and `include/`:
    * Docker tags: `wallarm/node:X.Y.Z-N`
    * Installer URLs: `aio-native-X.Y.Z.x86_64.sh` and `aio-native-X.Y.Z.aarch64.sh`
    * Helm chart `--version` flags
    * Plain text version mentions in requirements and compatibility notes

12. **Verify** no stale references remain — grep for the old version string. Changelog/history sections are the only valid exception.

### Part 5: Update related docs (if needed)

13. Based on the Jira issues analysis, determine if any other docs need updates:
    * **New config parameters** → add to the relevant configuration reference page (see step 13a below)
    * **Changed feature behavior** → update the feature documentation page
    * **New artifact type** → create deployment docs or add to existing ones
    * **New protocol/format support** → update overview and setup pages

13a. **For new config parameters**, the parameter must appear in **every** code example where it is relevant — not just in its own dedicated subsection. Update both:

    * **Article-level overview / general config examples** — the full configuration sample(s) at the top of the page that show how all settings fit together. Add the new parameter there alongside related optional settings, typically commented out (e.g., `# new_param: value`) so users discover it when scanning the overall config shape.
    * **Feature-specific code blocks** — any other example in the page (or in deployment guides, feature pages) that demonstrates the same component or mode the new parameter belongs to.

    Cover both AIO/Docker config (`docs/latest/installation/native-node/all-in-one-conf.md`) and Helm chart values (`docs/latest/installation/native-node/helm-chart-conf.md`) when the parameter exists for both form factors. Do NOT add Helm chart examples for parameters that were not actually added to the Helm chart values (see step 3).

    Search for code blocks that need updating:
    ```bash
    grep -n "mode: connector-server\|mode: tcp-capture-v2\|mode: envoy-external-filter" docs/latest/installation/native-node/all-in-one-conf.md
    ```
    Then audit related deployment/feature pages that copy the same config shape.

### Part 6: Validate

14. **Verify**:
    * All cross-references in changelog entries resolve
    * No stale version numbers remain (except in history)
    * Both x86_64 and ARM64 installer URLs are updated
    * Changelog entries match the Jira issues (nothing missing, nothing invented)

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

* Publish changelog before confirming artifacts are available
* Include internal/infrastructure issues in the customer-facing changelog
* Invent changes not present in the Jira release
* Change existing changelog entries unless fixing a factual error
* Modify wrapper files in `docs/6.x/` or `docs/7.x/`
* Bump versions in `docs/5.0/` unless explicitly requested
* Forget to check both x86_64 and ARM64 installer URLs
* Mix up NGINX Node and Native Node changelogs
* Proceed without author confirmation on unclear issues
* Assume that AIO and Helm chart got the same parameters in a release — verify via linked PRs, and if unclear, ask the author for the Helm chart PR or confirmation
* Add a "new config parameter" bullet to a Helm chart changelog entry without confirming the parameter was actually added to `values.yaml`
* Add a new parameter only to its own reference subsection — also add it to the article-level overview/general config example and to any feature-specific example block where it applies
