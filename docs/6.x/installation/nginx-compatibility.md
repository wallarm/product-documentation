# NGINX Version Compatibility for the All-in-one Installer

This article lists the NGINX versions supported by each Wallarm NGINX Node release when installed using the [all-in-one installer](nginx/all-in-one.md).

Support for NGINX versions is added **incrementally** and is **cumulative**: a Node version works with the NGINX versions listed for it and all earlier ones. The tables below show the latest NGINX versions supported by each Node version.

For the exact version added in a specific release, see the [NGINX Node changelog](../updating-migrating/node-artifact-versions.md), or [subscribe to release updates](../updating-migrating/subscribe-to-release-updates.md).

## Supported NGINX versions

### NGINX Node 6.x

| Node version   | NGINX stable      | NGINX mainline    | NGINX Plus    |
|----------------|-------------------|-------------------|---------------|
| 6.12.6–6.12.7  | 1.30.3 and below  | 1.31.2 and below  | R37 and below |
| 6.12.5         | 1.30.2 and below  | 1.31.1 and below  | R37 and below |
| 6.12.4         | 1.30.2 and below  | 1.31.1 and below  | R35 and below |
| 6.12.2–6.12.3  | 1.30.1 and below  | 1.31.0 and below  | R35 and below |
| 6.11.3–6.12.1  | 1.30.0 and below  | 1.29.8 and below  | R35 and below |
| 6.11.1–6.11.2  | 1.28.3 and below  | 1.29.7 and below  | R35 and below |
| 6.10.0–6.11.0  | 1.28.2 and below  | 1.29.3 and below  | R35 and below |
| 6.9.0          | 1.28.1 and below  | 1.29.3 and below  | R35 and below |
| 6.7.0–6.8.1    | 1.28.0 and below  | 1.29.3 and below  | R35 and below |
| 6.5.1–6.6.2    | 1.28.0 and below  | 1.27.5 and below  | R35 and below |
| 6.0.2–6.4.1    | 1.28.0 and below  | 1.27.5 and below  | R34 and below |
| 6.0.0–6.0.1    | 1.26.3 and below  | 1.27.4 and below  | R34 and below |

### NGINX Node 5.x

| Node version   | NGINX stable      | NGINX mainline    | NGINX Plus    |
|----------------|-------------------|-------------------|---------------|
| 5.3.19         | 1.28.1 and below  | 1.27.5 and below  | R33 and below |
| 5.3.13–5.3.18  | 1.28.0 and below  | 1.27.5 and below  | R33 and below |
| 5.3.10–5.3.12  | 1.26.3 and below  | 1.27.4 and below  | R33 and below |

<!-- ## NGINX versions in OS distributions

The all-in-one installer loads a Wallarm module that matches the NGINX binary already installed on the host. The NGINX versions shipped in the default repositories of common operating systems are listed below. All of them are supported by the Node versions above, except where noted for RHEL 8.

### Debian, Ubuntu, and Alpine

| OS release        | NGINX  |
|-------------------|--------|
| Debian 11         | 1.18.0 |
| Debian 12         | 1.22.1 |
| Debian 13         | 1.26.3 |
| Ubuntu 20.04      | 1.18.0 |
| Ubuntu 22.04      | 1.18.0 |
| Ubuntu 24.04      | 1.24.0 |
| Alpine 3.20–3.21  | 1.26   |
| Alpine 3.22–3.23  | 1.28   |
| Alpine 3.24       | 1.30   |

### RHEL-based (RHEL, CentOS Stream, AlmaLinux, Rocky Linux, Oracle Linux, UBI)

RHEL 8 and 9 provide NGINX through AppStream module streams; RHEL 10 provides it as a regular package.

| OS major   | Default NGINX      | Other available streams |
|------------|--------------------|-------------------------|
| 8 (el8)    | 1.14               | 1.18, 1.20, 1.22, 1.24  |
| 9 (el9)    | 1.20               | 1.22, 1.24, 1.26        |
| 10 (el10)  | 1.26 (not modular) | —                       |

The RHEL 8 `nginx:1.16` module stream is the only distribution NGINX without a prebuilt Wallarm module. To use it, request a custom build (see below). -->

## Custom NGINX version

For an NGINX build outside the supported set (for example, a custom-patched NGINX), Wallarm can provide a custom build — see [Custom NGINX Packages](custom/custom-nginx-version.md).
