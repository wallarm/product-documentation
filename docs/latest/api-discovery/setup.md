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

API Discovery detects sensitive data in requests and responses. To make sensitive data detection fully comply with your company's specific needs and industry-specific regulations such as GDPR, HIPAA, PCI DSS, etc., API Discovery provides the ability to fine-tune the detection process (requires node version 5.0.3 or higher). Customization empowers you to meet your company's unique data protection obligations. Additionally, if any proprietary or specialized sensitive data elements are presented in your data flows, you will benefit from the ability to define custom regular expressions for their precise identification.

Sensitive data detection is configured with the set **sensitive data patterns** - each pattern defines specific sensitive data and settings for its search. API Discovery goes with the set of default patterns. You can modify default patterns and add your own in Wallarm Console → **API Discovery** → **Configure API Discovery** → **Sensitive data**.

You can modify or disable the default (out-of-box) patterns and quickly restore them to initial settings if necessary. Your own patterns can be created, modified, disabled and deleted at any moment.

**Confidence scores**

You can use patterns and context words to configure your sensitive data detection. Choose the confidence scores from `0.1` to `1.0` for your patterns and context words to specify how confident you are that matching this expression or the presence of the string or word next to the sensitive data means the presence of sensitive data. Use appropriate scores to detect more real entities and produce fewer false positives.

The sensitive data is detected if score threshold of `0.3` is reached or exceeded: the context word scores are summed up, from the patterns the biggest is taken. See examples below for better understanding.

You should adjust confidence scores after trying them on actual traffic data.

**Pattern-based detection**

Use a regular expression in [PCRE](https://www.pcre.org/) format to match the expected sensitive data value. When you use a regular expression, detection becomes much more precise. You can use several patterns with different scores. If any is matched, the sensitive data is detected.

Patterns are suitable for fixed-length tokens, IDs, and URIs.

**Context words**

Wallarm looks at the words around the suspected sensitive data that match the pattern. If any of the context words is found, it boosts the resulting confidence score. The context can come from URL path, query parameter name, JSON keys, and other parameters next to it.

![API Discovery – Settings - Sensitive data](../images/about-wallarm-waf/api-discovery/api-discovery-settings-sd.png)

For example, on the picture above, the sensitive data will be detected:

* Immediately if the match to `JWT` or `AWS access key ID` pattern is found.
* If the match to `AWS key (weak)` is found, by itself it will not result "yes" (score of `0.1` is below threshold of `0.3`).
* But with the context words `access` (`0.1`) and `api` (`0.1`) the sum becomes `0.3` and sensitive data is detected.
* If we mark `auth` as mandatory, the situation changes: in absence of `auth`, scores of presented `access` and `api` will be ignored and cannot boost the pattern's score.

**Context word only-based detection**

If you specify context words without patterns, Wallarm decides on sensitive data presence based on the presence of the words. The more the confidence scores sum, the more likely the parameter will be marked as having your described sensitive data.

For some context-only searches, it is necessary to declare some words as **mandatory**: if the mandatory word is not presented in the value's context, the parameter does not contain sensitive data.

Example: personal_name

Context words:

* name
* first
* middle

We must match `middle_name,` but not `name` or `middle`. So, we set a score for `name` to `0.1` so we will not match `name`. But we must give `middle` a big score of `0.5` because "middle_name" is a strong combination.

To prevent us from detecting "middle" without `name,` we mark `name` as mandatory for an entity. If `name` is not found, no sensitive data is detected.

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
