# Authentication Flow Detection <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API Discovery analyzes HTTP headers and request parameters in the traffic to automatically identify the **authentication flow** used by each endpoint. This helps you find endpoints that lack proper authentication — the #1 API security risk.

You can use the **Authentication** filter in the API Discovery inventory to quickly find unauthenticated endpoints or endpoints using a specific authentication type.

![API Inventory: Auth flow filter](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-auth-flow-filter.png)

## Requirements

Authentication flow detection is supported starting from [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.10.0 and [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.23.0.

## Detected authentication types

Wallarm recognizes the following authentication types:

| Authentication flow | Description |
| --- | --- |
| **API key** | API key in headers (e.g., `x-api-key`) or query parameters. |
| **AWS Signature v4** | AWS request signing (`AWS4-HMAC-SHA256` in `Authorization` header). |
| **Basic** | HTTP Basic authentication. |
| **Bearer** | Bearer token in `Authorization` header. |
| **Cookie-based** | Session-based authentication using cookies (`cookie` / `set-cookie` headers). |
| **Digest** | HTTP Digest authentication. |
| **Hawk** | Hawk authentication scheme. |
| **HMAC signature** | HMAC-based request signing. |
| **Negotiate** | SPNEGO/Kerberos authentication. |
| **NTLM** | NTLM authentication. |
| **SCRAM** | Salted Challenge Response Authentication Mechanism. |

An endpoint can have multiple authentication types if different requests use different authentication mechanisms.

## Authentication status

In the **Authentication** tab of the endpoint details, Wallarm displays the overall authentication status for the endpoint. The status is based on the last 7 days of traffic and reflects what percentage of requests contained authentication parameters with valid values:

| Status | Condition | Description |
| --- | --- | --- |
| **Consistent** | 95%+ of requests authenticated | The endpoint is reliably protected by authentication. |
| **Partial** | 0–95% of requests authenticated | Some requests reach the endpoint without valid authentication. This may indicate recently added authentication that has not yet reached full coverage, or a misconfiguration. |
| **Missing** | 0% of requests authenticated | No valid authentication was detected in any requests to this endpoint over the observation period. |

!!! info "7-day observation window"
    Authentication status and coverage are calculated based on the last 7 days of traffic. When authentication is newly added to an endpoint, it initially appears as **Partial** and gradually moves to **Consistent** as the 7-day window fills with authenticated requests.

![Authentication tab in endpoint details](../images/about-wallarm-waf/api-discovery-2.0/endpoint-auth-tab.png)

## Authentication parameters

In the **Authentication** tab of the endpoint details, Wallarm lists every detected authentication parameter with the following details:

| Column | Description |
| --- | --- |
| **Type** | Authentication type (e.g., Bearer, Cookie, API key). |
| **Coverage** | Percentage of requests where this parameter contained a valid authentication value over the last 7 days. |
| **Key** | Parameter name and its context — header, cookie, or body field. |
| **Path** | Hierarchical location of the parameter within the request structure. |

A single endpoint can have multiple authentication parameters. For example, one endpoint might use a Bearer token in the `Authorization` header for 80% of requests and an API key in the body for 5%. Each parameter's coverage is calculated independently — coverages may not add up to 100%.
