# API Discovery Setup <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable <!--and configure -->Wallarm's [API Discovery](overview.md).

## Requirements

* Advanced API Security [subscription plan](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)
* For **GraphQL** - [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.1.0 or higher (not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far)
* For **SOAP** - [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 or higher (not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far)

## Enabled by default

API Discovery is included in all [forms](../installation/supported-deployment-options.md) of the Wallarm node installation and is enabled by default, analyzing all traffic going through Wallarm nodes.


## Configure

By clicking the **Configure** button in the **API Discovery** section, you proceed to the API discovery fine-tuning options, such customizing the sensitive data detection. Also, in the read-only mode, you can get familiar with general API Discovery settings defined by the Wallarm support group.

### Viewing general API Discovery settings

You can get familiar with general API Discovery settings defined by the Wallarm support group. To access them, in Wallarm Console, go to **API Discovery** → **Configure** → **Settings**.

![API Discovery - general settings - read-only](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-configure-settings-read-only.png)

They are:

* Parameters defining how API Discovery [detects noise](overview.md#noise-detection) to show only relevant APIs. This is important as API Discovery bases its findings on the real traffic:

    * **Filter endpoints by response content type** turns on/off validation of traffic by the `Content-type` header of response. The necessity of this validation in noise reduction depends on the peculiarities of your traffic.
    * Endpoint stability thresholds: **number of requests** within **time window**

* Percentage of requests used to: **determine parameter types** (50% by default) and **detect sensitive data** (10% by default). Non-100% values are used to lower CPU usage. Increased numbers are good for environments with less requests.

### Editable general API Discovery settings

In Wallarm Console → **API Discovery** → **Configure** → **Settings**, you can set some of general API Discovery settings yourself:

* Select protocols to discover: note that if you already have discovered data for some of the protocols and then deselect this protocol in settings, its data will remain and will still by displayed, but the new endpoints for the corresponding protocol will stop appearing, those already found will stop being updated.
* Select applications to be displayed: only data for the selected applications will be displayed by API Discovery. Note that this is about displaying: data is discovered for all applications, you just decide whether to show it.

### Customizing sensitive data detection

API Discovery [detects and highlights](sensitive-data.md) sensitive data consumed and carried by your APIs. You can fine-tune the existing detection process and extend it with your own data types to detect.

To view the current configuration and perform changes, in Wallarm Console, go to **API Discovery** → **Configure** → **Sensitive data**. Here, you can overview and modify the existing sensitive data patterns and add your own.

[See details here →](sensitive-data.md#customizing-sensitive-data-detection)

## Debug

To get and analyze the API Discovery logs, you can read the log file `/opt/wallarm/var/log/wallarm/appstructure-out.log` on the Linux machine where the node is running.
