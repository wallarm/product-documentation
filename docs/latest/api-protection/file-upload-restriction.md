# File Upload Restriction Policy <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

The [unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) is included in the [OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) list of most serious API security risks. Being a threat by itself (service slow-down or complete down by overload), this also serves as foundation to different attack types, for example, enumeration attacks. Allowing too large file upload is one of the causes of these risks. This article provides an information on how to configure file upload restrictions in Wallarm.

If you configure file upload restriction [using](#configuration-method) mitigation controls, in addition to the direct purpose of the control (limiting the maximum size of downloaded files), it can be used to reduce the attack surface, limiting the size of specific request parameters. For example, you can set up rules limiting the maximum size of an arbitrary header. In this case, the attacker will have fewer opportunities to push his payload or prevent the exploitation of BufferOverflow.

Note that file size upload restrictions are not the only [measure for preventing unrestricted resource consumption](#comparison-to-other-measures-for-preventing-unrestricted-resource-consumption) provided by Wallarm.

## Configuration method

Depending on your subscription plan, one of the following configuration methods for file upload restriction will be available:

* Mitigation controls ([Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription) - using mitigation control, you can set a limit not only for the entire size of the request, but for a specific parameter (more precise settings than in case of rule).
* Rules ([Cloud Native WAAP](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription)

## Mitigation control-based protection <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

As a part of [Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription, Wallarm provides the **File upload restriction policy** [mitigation control](../about-wallarm/mitigation-controls-overview.md).

!!! tip ""
    Requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 or higher and not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far.

Using this mitigation control, you can set a limit on the size of a specific parameter (more precise settings), or for simplicity, you can set it entirely on the request.

Limiting the size of specific request parameters, in addition to the direct purpose of the control (limiting the maximum size of downloaded files), allows reducing the attack surface. For example, you can set up rules limiting the maximum size of an arbitrary header. In this case, the attacker will have fewer opportunities to push his payload or prevent the exploitation of BufferOverflow.

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

Let us say you want to register as attack (without blocking) the attempts to upload via the PUT method files greater than 100KB in the request body to the `/put-upload` address of your application.

To do so, set the **File upload restriction policy** mitigation control as displayed on the screenshot:

![File upload restriction MC - example](../images/api-protection/mitigation-controls-file-upload-2.png)

In the example above, in the request point definition, the `post` is a Wallarm's [tag](../user-guides/rules/request-processing.md#metadata) meaning "in the request body".

#### JSON Base64 upload restriction 

Let us say you want to register as attack (without blocking) the attempts to upload a 100K+ Base64 encoded string of the file in a JSON object of a request body (only if this action targets the `/json-upload` address of your application).

To do so, set the **File upload restriction policy** mitigation control as displayed on the screenshot:

![File upload restriction MC - example](../images/api-protection/mitigation-controls-file-upload-3.png)

In the example above, in the request point definition, request point is defined via the sequence of Wallarm's [tags](../user-guides/rules/request-processing.md) meaning:

* `post` - in the request body
* `json_doc` - data in JSON format
* `hash` - for the key of the associative array key
* `file` - value for this key

#### Multipart form data upload restriction

Let us say you want to register as attack (without blocking) the attempts to submit 100K+ files via an HTML form that contains a file upload field (only if this action targets the `/multipart-upload` address of your application). Such action usually results in the `multipart/form-data` content type.

Thus, to apply this limitation, set the **File upload restriction policy** mitigation control as displayed on the screenshot:

![File upload restriction MC - example](../images/api-protection/mitigation-controls-file-upload-4.png)

In the example above, in the request point definition, request point is defined via the sequence of Wallarm's [tags](../user-guides/rules/request-processing.md) meaning:

* `post` - in the request body
* `multipart` - data of the `multipart/form-data` content type
* `file` - "file part" of mixed content produced by the form

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
