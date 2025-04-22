# API Discovery Setup <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable, configure and debug the [API Discovery](overview.md) module.

## Enable

API Discovery is included in all [forms](../installation/supported-deployment-options.md) of the Wallarm node installation. During node deployment, it installs the API Discovery module but keeps it disabled by default.

To enable and run API Discovery correctly:

1. Make sure your [subscription plan](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) includes **API Discovery**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
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

### Customizing sensitive data detection

API Discovery [detects and highlights](sensitive-data.md) sensitive data consumed and carried by your APIs. You can fine-tune the existing detection process and extend it with your own data types to detect.

To view the current configuration and perform changes, in Wallarm Console, go to **API Discovery** → **Configure API Discovery** → **Sensitive data**. Here, you can overview and modify the existing sensitive data patterns and add your own.

[See details here →](sensitive-data.md#customizing-sensitive-data-detection)

## Debug

To get and analyze the API Discovery logs, you can use the following methods:

* Read the log file `/opt/wallarm/var/log/wallarm/appstructure-out.log` on the machine where the node is running.
* If the Wallarm node is deployed as the Kubernetes Ingress controller: check the status of the pod running the Tarantool and `wallarm-appstructure` containers. The pod status must be **Running**.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    Read the logs of the `wallarm-appstructure` container:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```
