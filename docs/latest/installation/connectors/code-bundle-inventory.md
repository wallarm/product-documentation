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

## MuleSoft

[How to upgrade](mulesoft.md#upgrading-the-policy)

The current version can be found in the `pom.xml` file of the downloaded Wallarm policy or in the policy information in the Mulesoft UI.

| Policy version      | [Native Node version](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 2.x                 | 0.8.2 and lower     |
| 3.x                 | 0.8.3 and higher    |

### 3.0.1 (2024-11-20)

* Added the `WALLARM NODE MAX RETRIES` and `WALLARM NODE RETRY INTERVAL` parameters

    These parameters allow users to configure the maximum number of retry attempts and the interval between retries when sending data to Wallarm Nodes during network failures.

### 3.0.0 (2024-11-14)

Requires Native Node version 0.8.3 or higher.

* Added the `CLIENT HOST EXPRESSION` and `CLIENT IP EXPRESSION` parameters

    They allow to specify custom [DataWeave](https://docs.mulesoft.com/dataweave/latest/dw-functions) expressions for extracting the original host and remote IP, aligning with [Mulesoft's IP Blocklist policy](https://docs.mulesoft.com/mule-gateway/policies-included-ip-blocklist).

### 2.0.3 (2024-11-13)

* Bug fixes

### 2.0.2 (2024-11-06)

* Bug fixes

### 2.0.1 (2024-10-10)

* Initial release

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

The current version is specified in the `data.handler.lua.VERSION` parameter of the Wallarm Lua plugin code.

[How to upgrade](kong-api-gateway.md#upgrading-the-wallarm-lua-plugin)

### 1.1.0 (2024-09-13)

* Initial release

## Istio

[How to upgrade](istio.md#upgrading-the-wallarm-lua-plugin)

### 0.4.5 (2024-09-13)

* Initial release

<!-- ## Broadcom - TBD -->
