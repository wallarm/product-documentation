---
name: release-notes
description: "Add release notes and changelog entries for a new Wallarm Node version. Covers artifact changelog and what-is-new page. Format: version header with date, bullet list with Added/Fixed/Changed/Removed verbs, links to feature docs and CVEs."
---

# Prompt

You are adding release notes for a new version of a Wallarm Node artifact.

## Input

The user provides:
- **Artifact type**: NGINX Node or Native Node
- **Version number**: e.g., 6.12.0 or 0.25.0
- **Release date**: YYYY-MM-DD
- **Changes**: list of features, fixes, and other changes
- **Form factors** (optional): which artifact forms (all-in-one, Docker, Helm, AMI) get this version

## Steps

1. **Read the existing changelog file** to understand format and latest entries:
   - NGINX Node: `docs/latest/updating-migrating/node-artifact-versions.md` (if exists) or `docs/6.x/updating-migrating/node-artifact-versions.md`
   - Native Node: `docs/latest/updating-migrating/native-node/node-artifact-versions.md`

2. **Add the version entry** at the top of the relevant form factor section(s), following this format:

```markdown
### X.Y.Z (YYYY-MM-DD)

* Added [feature name](../../path/to/feature-doc.md) — short description of what was added
* Added support for [capability] in [component]
* Fixed [description of the bug](link-if-CVE)
* Fixed security vulnerabilities:

    * [CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)
    * [CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)
* Changed [what changed] — from X to Y
* Bumped [dependency] version to X.Y.Z
* Minor bug fixes and performance improvements
```

3. **Update the what-is-new page** if the release includes user-facing features:
   - `docs/latest/updating-migrating/what-is-new.md`
   - Add or update the section describing the feature

4. **Verify links**: ensure all cross-references to feature pages resolve correctly.

## Format rules

- Start every bullet with a past-tense verb: Added, Fixed, Changed, Removed, Bumped, Improved
- Link new features to their documentation pages
- Link CVEs to NVD: `[CVE-YYYY-NNNNN](https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN)`
- Link GitHub advisories: `[GHSA-xxxx](https://github.com/advisories/GHSA-xxxx)`
- Group related changes under a parent bullet with indented sub-bullets
- Use tables for metrics changes: `| Change | Metric |` with columns `New`, `Changed`, `Renamed`, `Removed`
- Date format in header: `(YYYY-MM-DD)`
- If the same version applies to multiple form factors (all-in-one, Docker, Helm), add it under each relevant H2 section
- Keep the note "History of updates simultaneously applies to x86_64 and ARM64 versions" if present

## Do NOT

- Change existing changelog entries unless fixing a factual error
- Add a version entry without a date
- Forget to add entries for all relevant form factors
- Mix up NGINX Node and Native Node changelogs
