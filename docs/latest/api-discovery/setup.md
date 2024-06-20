# API Discovery Setup <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

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

### Customizing risk score calculation

You can configure the weight of each factor in [risk score](risk-score.md) calculation and calculation method.

### Customizing sensitive data detection

API Discovery detects sensitive data in requests. To make sensitive data detection fully comply with the specific needs of your company and industry-specific regulations such as GDPR, HIPAA, PCI DSS, etc., API Discovery provides the ability of fine-tuning the detection process. Customization empowers you to meet your company unique data protection obligations. Additionally, if any proprietary or specialized sensitive data elements are presented in your data flows, you will benefit from the ability to define custom regular expressions for its precise identification.

Sensitive data detection is configured with the set **sensitive data patterns** - each pattern defines specific sensitive data and settings for its search. API Discovery goes with the set of default patterns. You can modify default patterns and add your own in Wallarm Console → **API Discovery** → **Configure API Discovery** → **Sensitive data**.

You cannot delete the default patterns. If you modified them, you can at any moment restore them to the initial settings. You own patterns can be both modified and deleted at any moment. You can temporarily disable any pattern without deleting it.

**Scores**

You can use patterns and context words to configure your sensitive data detection. Choose the confidence scores from `0.1` to `1.0` for your patterns and context words to specify how confident you are that matching to this expression or presence of the string or word means presence of sensitive data. Use appropriate scores to detect more real entities and produce fewer false positives.

It is recommended that you adjust score values after trying them on real traffic data.

**Pattern based detection**

You can use a string or a regular expression in [PCRE](https://www.pcre.org/) format as patterns for parameter's **value**. When you use a regular expression, detection becomes much more precise. You can use several patterns with different scores. If any is matched, the sensitive data is detected.

Patterns are good for fixed-length tokens, IDs, and URIs.

**Context words**

Wallarm looks at 5 words ahead of the value that matched the pattern and if a context word is among them, it boosts the resulting confidence score. The context words can be the URL path, query parameter name, JSON keys, and other parameters close to the value.

![API Discovery – Settings - Sensitive data](../images/about-wallarm-waf/api-discovery/api-discovery-settings-sd.png)

**Context word only based detection**

If you specify context words without patterns, Wallarm decides on sensitive data presence based on presence of the words. The more the sum of the confidence scores is, the more chances that the parameter will be marked as having your described sensitive data.

For some context-only searches, it is necessary to declare some words as **definitive**: if definitive word is not presented in the value’s context, the parameter definitely does not contain sensitive data.

Example: personal_name

Context words:

* name
* first
* middle

We have to match on `middle_name`, but not on `name` or on `middle`. So, we set a score for `name` to `0.1` so we will not match on `name`. But we have to give `middle` a big score of `0.5`, because “middle_name” is a strong combination.

To not make us detect on “middle” without `name`, we mark `name` as definitive for an entity. If `name` is not found, no sensitive data is detected.

![API Discovery – Settings - Sensitive data - Creating custom pattern](../images/about-wallarm-waf/api-discovery/api-discovery-settings-sd-own-pattern.png)

## Debug

To get and analyze the API Discovery logs, you can use the following methods:

* If the Wallarm node is installed from individual DEM/RPM packages: run the standard utility **journalctl** or **systemctl** inside the instance.

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* If the Wallarm node is deployed from the Docker container, Amazon Machine Image (AMI) or Google Cloud Machine Image: read the log file `/opt/wallarm/var/log/wallarm/appstructure-out.log` inside the container.
* If the Wallarm node is deployed as the Kubernetes Ingress controller: check the status of the pod running the Tarantool and `wallarm-appstructure` containers. The pod status must be **Running**.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    Read the logs of the `wallarm-appstructure` container:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```
