# API Discovery Setup <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable, configure and debug the [API Discovery](overview.md) module.

## Enable

API Discovery is included in all [forms](../installation/supported-deployment-options.md) of the Wallarm node installation, except for the Debian 11.x and Ubuntu 22.04 individual packages. During node deployment, it installs the API Discovery module but keeps it disabled by default.

To enable and run API Discovery correctly:

1. If you install node from the individual packages, make sure your Wallarm node is of the [supported version](../updating-migrating/versioning-policy.md#version-list).

    To ensure that you always have access to the full range of the API Discovery features, it is recommended to check for updates to the `wallarm-appstructure` package on a regular basis as follows:


    === "Debian Linux"
        ```bash
        sudo apt update
        sudo apt install wallarm-appstructure
        ```
    === "RedHat Linux"
        ```bash
        sudo yum update
        sudo yum install wallarm-appstructure
        ```
1. Make sure your [subscription plan](../about-wallarm/subscription-plans.md#subscription-plans) includes **API Discovery**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. In Wallarm Console → **API Discovery** → **Configure API Discovery**, enable traffic analysis with API Discovery.

Once the API Discovery module is enabled, it will start the traffic analysis and API inventory building. The API inventory will be displayed in the **API Discovery** section of Wallarm Console.

## Configure

By clicking the **Configure API Discovery** button in the **API Discovery** section, you proceed to the API discovery fine-tuning options, such as choosing applications for API discovery and customizing the risk score calculation.

### Choosing applications for API Discovery

You may enable/disable API Discovery for all applications or only the selected ones:

1. Ensure that the applications are added as described in the [Setting up applications](../user-guides/settings/applications.md) article.

    If the applications are not configured, structures of all APIs are grouped in one tree.

1. Enable API Discovery for the required applications in Wallarm Console → **API Discovery** → **Configure API Discovery**.

    ![API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

When you add a new application in **Settings** → **[Applications](../user-guides/settings/applications.md)**, it is automatically added to the list of applications for API discovery in the **disabled** state.

### Customizing risk score calculation

You can configure the weight of each factor in [risk score](risk-score.md) calculation and calculation method.

## Debug

To get and analyze the API Discovery logs, you can use the following methods:

* If the Wallarm node is installed from source packages: run the standard utility **journalctl** or **systemctl** inside the instance.

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* If the Wallarm node is deployed from the Docker container: read the log file `/var/log/wallarm/appstructure.log` inside the container.
* If the Wallarm node is deployed as the Kubernetes Ingress controller: check the status of the pod running the Tarantool and `wallarm-appstructure` containers. The pod status must be **Running**.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    Read the logs of the `wallarm-appstructure` container:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```
