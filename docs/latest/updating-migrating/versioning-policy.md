# WAF node versioning policy

This policy describes the method of versioning of different WAF node artifacts: Linux packages, Docker containers, Helm charts, etc. You can use this document to select the WAF node version for installation and to schedule updates of installed packages.

!!! info "Artifact"
    The artifact is the result of WAF node development that is used to install the WAF node on the platform. For example: Linux packages, Kong API modules, Docker containers, etc.

## Version list

| WAF node version | Release date   | Support until |
|------------------|----------------|---------------|
| 2.14 and lower   |                | June 2021     |
| 2.16             | October 2020   | July 2021     |
| 2.18             | February 2021  | November 2021 |
| 3.0              | July 2021      |               |
| 3.2              | August 2021    |               |
| 4.0              |4th quarter 2021|               |

## Version format

WAF node artifact versions have the following format:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]
```

| Parameter                | Description                                                                                                                                                                                                                                                                                                         | Average release rate          |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `<MAJOR_VERSION>`              | Major WAF node version:<ul><li>Major rework of the component</li><li>Incompatible changes</li></ul>Initial value is `2`. The value increases by 1, for example: `2.14.0`, `3.1.0`.                                                                                                                    | No release expected              |
| `<MINOR_VERSION>`              | Minor WAF node version:<ul><li>New product features</li><li>Major bug fixes</li><li>Other compatible changes</li></ul>The value increases by 2, for example: `2.12`, `2.14`.                                                                                                             | Once a quarter                         |
| `<PATCH_VERSION>`              | WAF node patch version:<ul><li>Minor bug fixes</li><li>New features added after a special request</li></ul>Initial value is `0`. The value increases by 1, for example: `2.14.0`, `2.14.1`.                                                                                                                                     | Once a month                        |
| `<BUILD_NUMBER>` (optional) | WAF node build version. The value is assigned automatically by the employed package build platform. The value will not be assigned to artifacts built using a manual process.<br />The value increases by 1, for example: `2.14.0-1`, `2.14.0-2`. If the first build fails, the build is run again and the value is incremented. | As new `<PATCH_VERSION>` released |

We recommend using different WAF node version format when downloading the packages or images. The format depends on the [WAF node installation form](../admin-en/supported-platforms.md):

* `<MAJOR_VERSION>.<MINOR_VERSION>` for Linux packages
* `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]` for Docker and cloud images, and Helm charts

    When pulling Wallarm Docker images, you can also specify the version of the WAF node in the format `<MAJOR_VERSION>.<MINOR_VERSION>`. Since pulled version of the WAF node contains changes of the latest available patch version, behavior of the same `<MAJOR_VERSION>.<MINOR_VERSION>` image version pulled in different time periods may differ.

Versions of WAF node packages may differ within the same artifact. For example, if only one package needs to be updated, then the remaining packages retain the previous version.

## Version support

Wallarm supports 3 latest versions of the WAF node in the following ways:

* In the latest version, releases bug fixes. May release new features after a special request.
* In the previous version, releases bug fixes.
* In the third available version, releases bug fixes for 3 months after the date of the latest version release. In 3 months, the version will be deprecated.

When installing a WAF node for the first time, it is recommended to use the latest available version. When installing an additional WAF node in the environment with already installed WAF nodes, it is recommended to use the same minor version in all installations for full compatibility.

## Version update

It is assumed that you are using the latest available version of the WAF node when installing, updating, or configuring the product. The WAF node instructions describe commands that automatically install the latest available patch and build.

### New version notification

Wallarm publishes information about the new minor version in the following sources:

* Public Documentation
* [News portal](https://changelog.wallarm.com/)
* Wallarm Console

    ![!Notification about a new version in Wallarm Console](../images/updating-migrating/wallarm-console-new-version-notification.png)

Information about available updates for minor WAF node versions and for WAF node patch versions is also displayed in Wallarm Console → **Nodes** for regular nodes. Each package has the status **Up to date** or the list of available updates. For example, the card of the WAF node with the latest component versions installed looks like:

![!Node card](../images/user-guides/nodes/view-regular-node-comp-vers.png)

### Update procedure

Along with the release of the new WAF node minor version, installation instructions are also published. To access instructions regarding how to update installed artifacts, please use the appropriate instructions from the **Updating and Migrating** section.

After updating to a new minor version or patch version, all previous WAF node settings will be saved and applied to the new version.
