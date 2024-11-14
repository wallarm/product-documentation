# Wallarm Node Versioning Policy

This document details Wallarm's versioning policy for its self-hosted filtering nodes, available as [NGINX-based and Native nodes](../installation/nginx-native-node-internals.md). It covers versioning standards, release schedules, and compatibility guidelines to help you choose, update, and manage node versions effectively.

Each node version is released as a set of artifacts - such as Docker images, Helm charts, or all-in-one installers - packaged for deployment on different platforms.

## Version list

| NGINX Node version | Native Node version | Release date   | Support until |
|--------------------|---------------------|----------------|---------------|
|2.18 and lower 2.x| -   |                | November 2021 |
| 3.6 and lower 3.x| -   | October 2021   | November 2022 |
| 4.6 and lower 4.x| -   | June 2022      | April 2024    |
| 4.8              | -   | October 2023   | November 2024 |
| 4.10             | -   | January 2024   |               |
| 5.x              | 0.x | July 2024      |               |

## Version structure

Node versions follow this format:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]
```

| Element | Description | Release frequency |
| ------- | ----------- | ----------------- |
| `<MAJOR_VERSION>` | Major version changes indicate significant updates, major new features, or breaking changes. Increments by +1, e.g., `4.x` and `5.x`. | Every 6 months or as needed for major changes |
| `<MINOR_VERSION>` | Minor version changes include enhancements and new capabilities within existing functionality, without introducing major new use cases. Increments by +1, e.g., `5.0` and `5.1`. | Monthly |
| `<PATCH_VERSION>` | Patches for minor bug fixes or specific enhancements. Applies to the latest minor release only. Increments by +1, e.g., `5.1.0` and `5.1.1`. | As needed |
| `<BUILD_NUMBER>` (optional) | Optional build identifier, auto-assigned in some packaged versions. Increments by +1, e.g., `5.1.0-1` and `5.1.0-2`. | As new `<PATCH_VERSION>` released |

This versioning approach applies equally to both the NGINX and Native Nodes. Major releases for one node type are mirrored in the other.

## Version support policy

Wallarm supports the 2 most recent major versions, including bug fixes, feature updates, and vulnerability patches.

Upon the release of a new major version, support for the corresponding version minus two (e.g., 6.x → 4.x) will end after 3 months.

Deprecated versions remain available for download but do not receive updates.

## NGINX compatibility

Most NGINX Node artifacts align with the stable version from upstream NGINX sources.

For example, the Wallarm Ingress Controller is based on the [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx). When a new upstream version is released, Wallarm updates its version within 30 days, issuing it as a new minor release.

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
