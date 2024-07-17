# Filtering node versioning policy

This policy describes the method of versioning of different Wallarm filtering node artifacts: Linux packages, Docker containers, Helm charts, etc. You can use this document to select the filtering node version for installation and to schedule updates of installed packages.

!!! info "Artifact"
    The artifact is the result of Wallarm nodes development that is used to install the filtering node on the platform. For example: Linux packages, Kong API modules, Docker containers, etc.

## Version list

| Node version | Release date   | Support until |
|------------------|----------------|---------------|
|2.18 and lower 2.x|                | November 2021 |
| 3.6 and lower 3.x| October 2021   | November 2022 |
| 4.6 and lower 4.x| June 2022      | April 2024    |
| 4.8              | October 2023   | November 2024 |
| 4.10             | January 2024   |               |
| 5.0              | July 2024      |               |

## Version format

Wallarm filtering node artifact versions have the following format:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]
```

| Parameter                | Description                                                                                                                                                                                                                                                                                                         | Average release rate          |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `<MAJOR_VERSION>`              | Major Wallarm node version:<ul><li>Major rework of the component</li><li>Incompatible changes</li></ul>Initial value is `2`. The value increases by 1, for example: `3.6.0`, `4.0.0`.                                                                                                                    | July 2024              |
| `<MINOR_VERSION>`              | Minor Wallarm node version:<ul><li>New product features</li><li>Major bug fixes</li><li>Other compatible changes</li></ul>The value increases by 2, for example: `4.0`, `4.2`.                                                                                                             | Once a quarter                         |
| `<PATCH_VERSION>`              | Node patch version:<ul><li>Minor bug fixes</li><li>New features added after a special request</li></ul>Initial value is `0`. The value increases by 1, for example: `4.2.0`, `4.2.1`.                                                                                                                                     | Once a month                        |
| `<BUILD_NUMBER>` (optional) | Node build version. The value is assigned automatically by the employed package build platform. The value will not be assigned to artifacts built using a manual process.<br />The value increases by 1, for example: `4.2.0-1`, `4.2.0-2`. If the first build fails, the build is run again and the value is incremented. | As new `<PATCH_VERSION>` released |

We recommend using different Wallarm node version format when downloading the packages or images. The format depends on the [Wallarm node installation form](../installation/supported-deployment-options.md):

* `<MAJOR_VERSION>.<MINOR_VERSION>` for Linux packages
* `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` for Helm charts
* `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]` for Docker and cloud images

    When pulling Wallarm Docker images, you can also specify the version of the filtering node in the format `<MAJOR_VERSION>.<MINOR_VERSION>`. Since pulled version of the filtering node contains changes of the latest available patch version, behavior of the same `<MAJOR_VERSION>.<MINOR_VERSION>` image version pulled in different time periods may differ.

Versions of Wallarm nodes packages may differ within the same artifact. For example, if only one package needs to be updated, then the remaining packages retain the previous version.

## Version support

Wallarm supports only 3 latest versions of the filtering node in the following ways:

* For the latest version (e.g. 4.2): allows package download, releases bug fixes and updates third‑party components if detecting vulnerabilities in the used version. May release new features after a special request.
* For the previous version (e.g. 4.0): allows package download and releases bug fixes.
* For the third available version (e.g. 3.6): allows package download and releases bug fixes for 3 months after the date of the latest version release. In 3 months, the version will be deprecated.

Node artifacts of deprecated versions are available for download and installation, but bug fixes and new features are not released in deprecated versions.

When installing a filtering node for the first time, it is recommended to use the latest available version. When installing an additional filtering node in the environment with already installed nodes, it is recommended to use the same version in all installations for full compatibility.

## NGINX upgrade

Most Wallarm modules are distributed with NGINX components of their own versions. To keep the Wallarm modules working with the latest versions of NGINX components, we update them as follows:

* Wallarm DEB and RPM packages are based on the official NGINX and NGINX Plus modules. Once the new version of NGINX / NGINX Plus is released, Wallarm is committed to providing an update of its version in 1 day. Wallarm publishes this update as the new minor/patch version of supported node versions.
* Wallarm Ingress Controller is based on the [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx). Once the new version of Community Ingress NGINX Controller is released, Wallarm is committed to providing an update of its version in the following 30 days. Wallarm publishes this update as the new minor version of the latest Ingress controller.

## Version update

It is assumed that you are using the latest available version of the filtering node when installing, updating, or configuring the product. The Wallarm node instructions describe commands that automatically install the latest available patch and build.

### New version notification

Wallarm publishes information about the new major and minor versions in the following sources:

* Public Documentation
* [News portal](https://changelog.wallarm.com/)
* Wallarm Console

    ![Notification about a new version in Wallarm Console](../images/updating-migrating/wallarm-console-new-version-notification.png)

Information about available updates for major and minor Wallarm node versions and for Wallarm node patch versions is also displayed in Wallarm Console → **Nodes** for regular nodes. Each package has the status **Up to date** or the list of available updates. For example, the card of the filtering node with the latest component versions installed looks like:

![Node card](../images/user-guides/nodes/view-regular-node-comp-vers.png)

### Update procedure

Along with the release of the new filtering node major and minor versions, installation instructions are also published. To access instructions regarding how to update installed artifacts, please use the appropriate instructions from the **Updating and Migrating** section.
