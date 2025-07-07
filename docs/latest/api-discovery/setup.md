# API Discovery Setup <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable <!--and configure -->Wallarm's [API Discovery](overview.md).

## Requirements

* Advanced API Security [subscription plan](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)
* For **GraphQL** - [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.1.0 or higher (not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far)
* For **SOAP** - [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 or higher (not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far)

## Enabled by default

API Discovery is included in all [forms](../installation/supported-deployment-options.md) of the Wallarm node installation and is enabled by default, analyzing all traffic going through Wallarm nodes.

## Debug

To get and analyze the API Discovery logs, you can read the log file `/opt/wallarm/var/log/wallarm/appstructure-out.log` on the Linux machine where the node is running.

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
