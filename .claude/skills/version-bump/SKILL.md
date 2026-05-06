---
name: version-bump
description: "Bump Wallarm Node version numbers (Docker tags, installer URLs, Helm chart versions) across all installation and deployment docs. Searches for all occurrences, replaces consistently, verifies no stale references remain."
---

# Prompt

You are bumping a Wallarm Node version number across the documentation.

## Input

The user provides:
- **Artifact type**: NGINX Node or Native Node
- **Old version**: the version string being replaced (e.g., `0.24.1`, `6.11.3`)
- **New version**: the replacement version string (e.g., `0.25.0`, `6.12.0`)
- **Scope** (optional): specific files or all deployment docs

## Steps

1. **Search for all occurrences** of the old version in `docs/latest/` and `include/`:
   - Use grep with the exact old version string
   - Note: version strings may appear in Docker tags (`wallarm/node:6.12.0`), installer URLs (`aio-native-0.25.0.x86_64.sh`), Helm chart versions, or plain text

2. **Categorize the files** found:
   - **Docker image docs**: `admin-en/installation-docker-en.md`, cloud platform deployment docs
   - **All-in-one installer docs**: `installation/native-node/all-in-one.md`, include snippets
   - **Helm chart docs**: `installation/native-node/helm-chart.md`, eBPF docs
   - **Update/migration docs**: `updating-migrating/` files
   - **Include snippets**: `include/waf/installation/` — these are shared across many pages

3. **Replace the version** in all identified files:
   - For Docker tags: update the image tag (e.g., `wallarm/node:6.11.3-1` → `wallarm/node:6.12.0-1`)
   - For installer URLs: update the filename (e.g., `aio-native-0.24.1.x86_64.sh` → `aio-native-0.25.0.x86_64.sh`)
   - For Helm charts: update the `--version` flag value
   - For plain text mentions: update version numbers in requirements, compatibility notes

4. **Verify** no stale references remain:
   - Grep for the old version string again — should return zero results in `docs/latest/` and `include/`
   - Exception: the old version may still appear in changelog/history sections — that is correct

5. **Do NOT touch**:
   - `docs/6.x/` or `docs/7.x/` files (they are wrappers, content comes from `docs/latest/`)
   - `docs/5.0/` files (legacy version, update only if explicitly requested)
   - Changelog entries that describe past versions

## Common file locations

### NGINX Node version bumps
- `docs/latest/admin-en/installation-docker-en.md`
- `include/waf/installation/all-in-one-installer-run.md`
- `include/waf/installation/all-in-one/launch-options.md`
- `include/waf/installation/all-in-one-installer-download.md`
- `docs/latest/installation/cloud-platforms/*/docker-container.md`
- `docs/latest/installation/heroku/docker-image.md`
- `docs/latest/updating-migrating/*.md`

### Native Node version bumps
- `docs/latest/installation/native-node/all-in-one.md`
- `docs/latest/installation/native-node/docker-image.md`
- `docs/latest/installation/native-node/helm-chart.md`
- `docs/latest/installation/oob/ebpf/deployment.md`
- `docs/latest/installation/oob/tcp-traffic-mirror/deployment.md`
- `docs/latest/updating-migrating/native-node/*.md`

## Do NOT

- Modify wrapper files in `docs/6.x/` or `docs/7.x/`
- Change version numbers in changelog/history sections that document past releases
- Bump versions in `docs/5.0/` unless explicitly requested
- Forget to check both x86_64 and ARM64 installer URLs
