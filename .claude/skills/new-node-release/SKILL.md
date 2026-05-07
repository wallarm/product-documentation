---
name: new-node-release
description: "Document a new Wallarm Node release: add changelog entry, update what-is-new page, and bump version numbers (Docker tags, installer URLs, Helm chart versions) across all deployment docs."
---

# Prompt

You are documenting a new Wallarm Node release. This involves two parts: writing changelog/release notes and bumping version numbers across deployment docs.

## Input

The author provides:
* **Artifact type**: NGINX Node or Native Node
* **New version**: e.g., `6.12.0` or `0.25.0`
* **Release date**: YYYY-MM-DD
* **Changes**: list of features, fixes, and other changes
* **Old version** (optional): the version being replaced — if not provided, determine it from the current changelog
* **Form factors** (optional): which artifact forms (all-in-one, Docker, Helm, AMI) get this version

## Steps

### Part 1: Release notes

1. **Read the existing changelog file** to understand format and latest entries:
   * NGINX Node: `docs/latest/updating-migrating/node-artifact-versions.md` (if exists) or `docs/6.x/updating-migrating/node-artifact-versions.md`
   * Native Node: `docs/latest/updating-migrating/native-node/node-artifact-versions.md`

2. **Add the version entry** at the top of the relevant form factor section(s):

```markdown
### X.Y.Z (YYYY-MM-DD)

* Added [feature name](../../path/to/feature-doc.md) — short description of what was added
* Added support for [capability] in [component]
* Fixed [description of the bug](link-if-CVE)
* Fixed security vulnerabilities:

    * [CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)
* Changed [what changed] — from X to Y
* Bumped [dependency] version to X.Y.Z
* Minor bug fixes and performance improvements
```

3. **Update the what-is-new page** if the release includes user-facing features:
   * `docs/latest/updating-migrating/what-is-new.md`
   * Add or update the section describing the feature

### Part 2: Version bump

4. **Determine the old version** from the changelog if not provided by the author.

5. **Search for all occurrences** of the old version in `docs/latest/` and `include/`:
   * Use grep with the exact old version string
   * Version strings appear in Docker tags (`wallarm/node:6.12.0`), installer URLs (`aio-native-0.25.0.x86_64.sh`), Helm chart `--version` flags, and plain text

6. **Replace the version** in all identified files:
   * Docker tags: `wallarm/node:6.11.3-1` → `wallarm/node:6.12.0-1`
   * Installer URLs: `aio-native-0.24.1.x86_64.sh` → `aio-native-0.25.0.x86_64.sh`
   * Helm charts: update the `--version` flag value
   * Plain text: version numbers in requirements, compatibility notes

7. **Verify** no stale references remain:
   * Grep for the old version string — should return zero results in `docs/latest/` and `include/`
   * Exception: the old version may still appear in changelog/history sections — that is correct

### Part 3: Validate

8. **Verify links**: ensure all cross-references to feature pages in changelog entries resolve correctly.

## Changelog format rules

* Start every bullet with a past-tense verb: Added, Fixed, Changed, Removed, Bumped, Improved
* Link new features to their documentation pages
* Link CVEs to NVD: `[CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)`
* Link GitHub advisories: `[GHSA-xxxx](https://github.com/advisories/GHSA-xxxx)`
* Group related changes under a parent bullet with indented sub-bullets
* Use tables for metrics changes: `| Change | Metric |` with columns `New`, `Changed`, `Renamed`, `Removed`
* Date format in header: `(YYYY-MM-DD)`
* If the same version applies to multiple form factors (all-in-one, Docker, Helm), add it under each relevant H2 section

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

* Change existing changelog entries unless fixing a factual error
* Add a version entry without a date
* Modify wrapper files in `docs/6.x/` or `docs/7.x/`
* Bump versions in `docs/5.0/` unless explicitly requested
* Change version numbers in changelog/history sections that document past releases
* Forget to check both x86_64 and ARM64 installer URLs
* Mix up NGINX Node and Native Node changelogs
