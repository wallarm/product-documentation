# Wallarm Node Versioning Policy

This document details Wallarm's versioning policy for self-hosted [NGINX-based and Native Nodes](../installation/nginx-native-node-internals.md) and [Edge Nodes](../installation/security-edge/overview.md), which share versions with self-hosted Native Nodes. It covers versioning standards, release schedules, and compatibility guidelines for managing node updates.

Each node version is released as a set of artifacts - such as Docker images, Helm charts, or all-in-one installers - packaged for deployment on different platforms.

## Version list

| NGINX Node version | Native and Edge Node version | Release date   | Support until |
|--------------------|---------------------|----------------|---------------|
| 2.18 and lower 2.x | -                   |                | November 2021 |
| 3.6 and lower 3.x  | -                   | October 2021   | November 2022 |
| 4.6 and lower 4.x  | -                   | June 2022      | April 2024    |
| 4.8                | -                   | October 2023   | November 2024 |
| 4.10               | -                   | January 2024   | July 2025     |
| 5.x                | 0.13.x-             | July 2024      |               |
| 6.x                | 0.14.x+             | March 2025     |               |

## Version structure

Node versions follow this format:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]
```

| Element | Description | Release frequency |
| ------- | ----------- | ----------------- |
| `<MAJOR_VERSION>` | Major version changes indicate significant updates, major new features, or breaking changes. Increments by +1, e.g., `4.x` and `5.x`. | Every 6 months or as needed for major changes |
| `<MINOR_VERSION>` | Minor version changes include enhancements and new capabilities within existing functionality, without introducing major new use cases. Increments by +1, e.g., `5.0` and `5.1`. | Monthly |
| `<PATCH_VERSION>` | Patches for minor bug fixes or specific enhancements. Applies to the latest minor release only. The number increases sequentially based on the number of commits in the release branch (+1, +2, etc.). For example, `5.1.0` and `5.1.1`. | As needed |
| `<BUILD_NUMBER>` (optional) | Indicates modifications unrelated to the Wallarm Node itself (e.g., dependency updates in the Helm chart). This number increments (e.g., `5.1.0-1`, `5.1.0-2`) only if changes are made to the artifact between patch releases. | As needed |

This versioning approach applies equally to all Node types. However, they are released independently.

## Version support policy

Wallarm supports the 2 latest major versions, limited to their latest minor versions, with bug fixes, feature updates, and vulnerability patches. For example, only the latest minor version of 5.x (e.g., 5.12) will be supported once 6.x is released.

Upon the release of a new major version, support for the corresponding version minus two (e.g., 6.x → 4.x) will end after 3 months.

Deprecated versions remain downloadable but are no longer updated.

## NGINX compatibility

Most NGINX Node artifacts align with the stable version from upstream NGINX sources.

For example, the Wallarm Ingress Controller is based on the [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx). When an upstream version is marked for deprecation, Wallarm updates to the new stable version within 30 days, releasing it as a minor version. Updates may occur earlier to ensure compatibility but will not delay beyond the deprecation designation.

## New version notification

Wallarm publishes release notes for major and minor updates in:

* Public Documentation - see [NGINX Node artifact inventory](node-artifact-versions.md) and [Native Node artifact inventory](native-node/node-artifact-versions.md)
* [Product Changelog](https://changelog.wallarm.com/)
* The updates section in the Wallarm Console

    ![Notification about a new version in Wallarm Console](../images/updating-migrating/wallarm-console-new-version-notification.png)
* Each node in Wallarm Console displays an **Up to date** status or lists available updates for each component.

    ![Node card](../images/user-guides/nodes/view-regular-node-comp-vers.png)

## Upgrade procedure

Installation instructions for major and minor updates are published alongside new versions. For detailed steps on updating specific artifacts, refer to **Operations → Node Upgrade** in the documentation.
