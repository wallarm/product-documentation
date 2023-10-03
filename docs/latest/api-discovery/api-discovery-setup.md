# Set up API Discovery

This article describes how to enable, configure and debug the **API Discovery** module.

## Enable

The `wallarm-appstructure` package is included in all [forms](../installation/supported-deployment-options.md) of the Wallarm node except for the Debian 11.x and Ubuntu 22.04 packages. During node deployment, it installs the API Discovery module but keeps it disabled by default.

To enable and run API Discovery correctly:

1. Make sure your Wallarm node is of the [supported version](../updating-migrating/versioning-policy.md#version-list).

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
1. Make sure your [subscription plan](subscription-plans.md#subscription-plans) includes **API Discovery**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. If you want to enable API Discovery only for the selected applications, ensure that the applications are added as described in the [Setting up applications](../user-guides/settings/applications.md) article.

    If the applications are not configured, structures of all APIs are grouped in one tree.

1. Enable API Discovery for the required applications in Wallarm Console → **API Discovery** → **Configure API Discovery**.

    ![API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

    !!! info "Access to API Discovery settings"
        Only administrators of your company Wallarm account can access the API Discovery settings. Contact your administrator if you do not have this access.

Once the API Discovery module is enabled, it will start the traffic analysis and API inventory building. The API inventory will be displayed in the **API Discovery** section of Wallarm Console.

## Configure

By clicking the **Configure API Discovery** button in the **API Discovery** section, you proceed to the API discovery fine-tuning options, such as choosing applications for API discovery and customizing the risk score calculation.

### Choosing applications for API Discovery

If the [API Discovery](../about-wallarm/api-discovery.md) subscription is purchased for your company account, you can enable/disable traffic analysis with API Discovery in Wallarm Console → **API Discovery** → **Configure API Discovery**.

You may enable/disable API Discovery for all applications or only the selected ones.

![API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

When you add a new application in **Settings** → **[Applications](settings/applications.md)**, it is automatically added to the list of applications for API discovery in the **disabled** state.

### Customizing risk score calculation

You can configure the weight of each factor in [risk score](../about-wallarm/api-discovery.md#endpoint-risk-score) calculation and calculation method.

Defaults: 

* Calculation method: `Use the highest weight from all criteria as endpoint risk score`.
* Default factor weights:

    | Factor | Weight |
    | --- | --- |
    | Active vulnerabilities | 9 |
    | Potentially vulnerable to BOLA | 6 |
    | Parameters with sensitive data | 8 |
    | Number of query and body parameters | 6 |
    | Accepts XML / JSON objects | 6 |
    | Allows uploading files to the server | 6 |

To change how risk score is calculated: 

1. Click the **Configure API Discovery** button in the **API Discovery** section.
1. Select calculation method: highest or average weight.
1. If necessary, disable factors you do not want to affect a risk score.
1. Set weight for the remaining.

    ![API Discovery - Risk score setup](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)
1. Save changes. Wallarm will re-calculate the risk score for your endpoints in accordance with the new settings in several minutes.

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
