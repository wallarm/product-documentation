# API Discovery Setup <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable <!--and configure -->Wallarm's [API Discovery](overview.md).

## Enable

API Discovery is included in all [forms](../installation/supported-deployment-options.md) of the Wallarm node installation. During node deployment, it installs the API Discovery module but keeps it disabled by default.

To enable and run API Discovery correctly:

1. Make sure your [subscription plan](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) includes **API Discovery**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. Contact the [Wallarm support team](https://support.wallarm.com/) to make decision on which options you need and enable them:

    * Old API Discovery (REST only)
    * New API Discovery (REST + GraphQL, better performance) - recommended

Once the API Discovery module is enabled, it will start the traffic analysis and API inventory building. The API inventory will be displayed in the **API Discovery** section of Wallarm Console.

<!--## Configure

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

### Customizing sensitive data detection

API Discovery [detects and highlights](sensitive-data.md) sensitive data consumed and carried by your APIs. You can fine-tune the existing detection process and extend it with your own data types to detect.

To view the current configuration and perform changes, in Wallarm Console, go to **API Discovery** → **Configure API Discovery** → **Sensitive data**. Here, you can overview and modify the existing sensitive data patterns and add your own.

[See details here →](sensitive-data.md#customizing-sensitive-data-detection)

## Debug

To get and analyze the API Discovery logs, you can read the log file `/opt/wallarm/var/log/wallarm/appstructure-out.log` on the Linux machine where the node is running.-->
