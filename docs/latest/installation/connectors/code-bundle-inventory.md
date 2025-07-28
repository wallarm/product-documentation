# Connector Code Bundle Changelog

This document lists the versions of connector code bundles that work with the Native Node (MuleSoft, Cloudflare, etc.).

## Version format

Connector code bundle versions follow this format:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>
```

| Element | Description |
| ------- | ----------- |
| `<MAJOR_VERSION>` | Significant updates, new features, or breaking changes. Requires a [Native Node update](../../updating-migrating/native-node/node-artifact-versions.md). |
| `<MINOR_VERSION>` | Enhancements or new features without breaking changes. |
| `<PATCH_VERSION>` | Minor bug fixes or enhancements. |

## MuleSoft Mule Gateway

[How to upgrade](mulesoft.md#upgrading-the-policy)

The current version can be found in the `pom.xml` file of the downloaded Wallarm policy or in the policy information in the MuleSoft UI.

| Policy version      | [Native Node version](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 2.x                 | 0.8.2 and lower     |
| 3.0.x               | 0.8.3 and higher    |
| 3.2.x               | 0.10.1 and higher   |

### 3.2.0 (2025-01-31)

Requires Native Node version 0.10.1 or higher.

* The response code to blocked malicious requests is now set to 403 using the `http-transform` plugin from the MuleSoft Enterprise Edition repository

    Previously, a 200 status code was returned with a message indicating the request was blocked in the response body. Authentication for the `mulesoft-releases-ee` repository in your [Maven `settings.xml`](../../installation/connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange) is now required in addition to the standard `anypoint-exchange-v3` repository to use the new connector version.
* Bugfix: ensure the uniqueness of the request identifiers
* Optimized memory consumption

### 3.0.1 (2024-11-20)

* Added the `WALLARM NODE MAX RETRIES` and `WALLARM NODE RETRY INTERVAL` parameters

    These parameters allow users to configure the maximum number of retry attempts and the interval between retries when sending data to Wallarm Nodes during network failures.

### 3.0.0 (2024-11-14)

Requires Native Node version 0.8.3 or higher.

* Added the `CLIENT HOST EXPRESSION` and `CLIENT IP EXPRESSION` parameters

    They allow to specify custom [DataWeave](https://docs.mulesoft.com/dataweave/latest/dw-functions) expressions for extracting the original host and remote IP, aligning with [MuleSoft's IP Blocklist policy](https://docs.mulesoft.com/mule-gateway/policies-included-ip-blocklist).

### 2.0.3 (2024-11-13)

* Bug fixes

### 2.0.2 (2024-11-06)

* Bug fixes

### 2.0.1 (2024-10-10)

* Initial release

## MuleSoft Flex Gateway

[How to upgrade](mulesoft-flex.md#upgrading-the-policy)

The current version can be found in `Cargo.toml` → `[package]` → `version` parameter of the downloaded Wallarm policy or in the policy information in the MuleSoft UI.

| Policy version      | [Native Node version](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 1.0.x               | 0.16.0 and higher   |

### 1.0.0 (2025-07-23)

* [Initial release](mulesoft-flex.md)

## CloudFront

[How to upgrade](aws-lambda.md#upgrading-the-lambdaedge-functions)

### 1.0.0 (2024-10-10)

* Initial release

## Cloudflare

[How to upgrade](cloudflare.md#upgrading-the-cloudflare-worker)

### 1.0.1

* Support custom blocking pages for malicious requests, configurable with the [parameters](cloudflare.md#configuration-options):

    * `wallarm_block_page.custom_path`
    * `wallarm_block_page.html_page`
    * `wallarm_block_page.support_email`

### 1.0.0 (2024-10-10)

* Initial release

## Kong API Gateway

[How to upgrade](kong-api-gateway.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* Initial release

## Istio

[How to upgrade](istio.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* Initial release

## Broadcom Layer7 API Gateway

[How to upgrade](layer7-api-gateway.md#upgrading-the-wallarm-policies)

### 1.0.0 (2024-11-07)

* Initial release

## Fastly

[How to upgrade](fastly.md#upgrading-the-wallarm-compute-service-on-fastly)

### 1.2.0 (2025-04-03)

* Added ability to use alternative configurations

    If you run multiple Compute services for Wallarm, you can [create multiple config stores](../../installation/connectors/fastly.md#4-create-the-wallarm-config-store) with different configurations and link each of them to corresponding service.

### 1.1.0 (2025-01-06)

* Added support for [log streaming endpoints](https://www.fastly.com/documentation/guides/integrations/logging/) with configuring via the optional `LOGGING_ENDPOINT` [parameter](fastly.md#4-create-the-wallarm-config-store)

### 1.0.0 (2025-01-02)

* Initial release

## IBM API Connect

[How to upgrade](ibm-api-connect.md#upgrading-the-policies)

The current version can be found in the Wallarm policy file → `info.version`. Both policies use the same version number.

| Policy version      | [Native Node version](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 1.0.1               | 0.13.3 or later in the 0.13.x series, or 0.14.1 or later |

### 1.0.1 (2025-05-20)

* Initial release
