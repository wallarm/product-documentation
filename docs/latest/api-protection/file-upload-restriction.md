# File Upload Restriction Policy <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

The [unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) is included in the [OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) list of most serious API security risks. Being a threat by itself (service slow-down or complete down by overload), this also serves as foundation to different attack types, for example, enumeration attacks. Allowing too large file upload is one of the causes of these risks. This article provides an information on how to configure file upload restrictions in Wallarm.

Note that file size upload restrictions are not the only [measure for preventing unrestricted resource consumption](#comparison-to-other-measures-for-preventing-unrestricted-resource-consumption) provided by Wallarm.

## Configuration method

Depending on your subscription plan, one of the following configuration methods for file upload restriction will be available:

* Mitigation controls ([Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription)
* Rules ([Cloud Native WAAP](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription)

## Mitigation control-based protection <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

As a part of [Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription, Wallarm provides the **File upload restriction policy** [mitigation control](../about-wallarm/mitigation-controls-overview.md).

!!! tip ""
    Requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 or higher and not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far.

### Creating and applying mitigation control

!!! info "Generic information on mitigation controls"
    Before proceeding: use the [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) article to get familiar with how **Scope** and **Mitigation mode** are set for any mitigation control.

To configure file upload restriction policy:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Use **Add control** → **File upload restriction policy**.
1. Describe the **Scope** to apply the mitigation control to.
1. Set **Size restrictions** for full request or its selected point.
1. In the **Mitigation mode** section, set action to be done.
1. Click **Add**.

### Mitigation control examples

#### Limiting size of a file uploaded via specific request field

Let us say you want to limit size of files uploaded to `/upload` address of your application `application-001` via the `upfile` POST request parameter. Limit must be 100KB. All exceeding the limit must be blocked.

To do so, set the **File upload restriction policy** mitigation control as displayed on the screenshot:

![File upload restriction MC - example](../images/api-protection/mitigation-controls-file-upload-1.png)

#### PUT upload restriction via exact point size

Let us say you want to register as attack (without blocking) the attempts to upload via the PUT method files greater than 100KB TBD to the `/put-upload` address of your application.

To do so, set the **File upload restriction policy** mitigation control as displayed on the screenshot:

![File upload restriction MC - example](../images/api-protection/mitigation-controls-file-upload-2.png)

#### JSON Base64 upload restriction 

Let us say you want to TBD.

To do so, set the **File upload restriction policy** mitigation control as displayed on the screenshot:

![File upload restriction MC - example](../images/api-protection/mitigation-controls-file-upload-3.png)

#### Multipart form data upload restriction

Let us say you want to TBD.

To do so, set the **File upload restriction policy** mitigation control as displayed on the screenshot:

![File upload restriction MC - example](../images/api-protection/mitigation-controls-file-upload-4.png)

## Rule-based protection

As a part of [Cloud Native WAAP](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription, Wallarm provides the **File upload restriction policy** [rule](../user-guides/rules/rules.md).

**Creating and applying the rule**

--8<-- "../include/rule-creation-initial-step.md"
1. Choose **Mitigation controls** → **File upload restriction policy**.
1. In **If request is**, [describe](../user-guides/rules/rules.md#configuring) the scope to apply the rule to.
1. In **Size restrictions** set size restriction and **Mode**.
1. Optionally, specify request point to apply restriction to (if not set, restriction is applied to the whole request size).

    ![File upload restriction - rule](../images/api-protection/rule-file-upload.png)

1. Wait for the [rule compilation and uploading to the filtering node to complete](../user-guides/rules/rules.md#ruleset-lifecycle).

## Viewing detected attacks

Violations of file upload restriction policies are displayed as [file upload violation](/attacks-vulns-list.md#file-upload-violation) attacks **Attacks** and **API Sessions**:

![File upload restriction - detected attacks](../images/api-protection/mitigation-controls-file-upload-detected.png)

You can switch between **Attacks** and **API Sessions** views using buttons in request details. All the attacks/sessions with this attack type can be found with the attack type filter set to **File upload violation** (also, use `file_upload_violation` [search tag](../user-guides/search-and-filters/use-search.md#search-by-attack-type) in **Attacks**).

## Comparison to other measures for preventing unrestricted resource consumption

Besides setting file upload restriction policies, Wallarm provides other mechanisms for preventing unrestricted resource consumption. They are:

* Detecting and blocking unrestricted resource consumption performed by bots (Wallarm's API Abuse Prevention, needs to be configured to work).
* [DoS protection](../api-protection/dos-protection.md) mitigation control (requires [Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription).
* [Advanced rate limiting](../user-guides/rules/rate-limiting.md).
