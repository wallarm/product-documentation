[variability-in-endpoints-docs]:       ../../about-wallarm/api-discovery.md#variability-in-endpoints
[changes-in-api-docs]:       ../../user-guides/api-discovery.md#tracking-changes-in-api
[bola-protection-for-endpoints-docs]:  ../../about-wallarm/api-discovery.md#automatic-bola-protection

# Configuration of BOLA (IDOR) protection

Behavioral attacks such as [Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) exploit the vulnerability of the same name. This vulnerability allows an attacker to access an object by its identifier via an API request and either read or modify its data bypassing an authorization mechanism. This article instructs you on protecting your applications against BOLA attacks.

By default, Wallarm automatically discovers only vulnerabilities of the BOLA type (also known as IDOR) but does not detect its exploitation attempts.

You have the following options to detect and block BOLA attacks with Wallarm:

* [Manual creation of **BOLA** trigger](#manual-creation-of-bola-trigger)
* [Using the API Discovery module with the automatic BOLA protection - enabled via the Wallarm Console UI](#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)

!!! warning "BOLA protection restrictions"
    Only Wallarm node 4.2 and above supports BOLA attack detection.

    Wallarm node 4.2 and above analyzes only the following requests for BOLA attack signs:

    * Requests sent via the HTTP protocol.
    * Requests that do not contain signs of other attack types, e.g. requests are not considered to be a BOLA attack if:

        * These requests contain signs of [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks).
        * These requests match the regular expression specified in the [rule **Create regexp-based attack indicator**](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

## Requirements

To protect resources from BOLA attacks, make sure your environment meets the following requirements:

* If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying real clients' IP addresses.

## Manual creation of BOLA trigger

For the Wallarm node to identify BOLA attacks:

1. Open Wallarm Console → **Triggers** and proceed to the **BOLA** trigger setup.
1. Set conditions for defining requests as a BOLA attack:

    * The number of **Requests from the same IP** for a certain period of time.
    * **URI** to be protected against BOLA attacks and receiving the specified number of requests. The value should be an API endpoint pointing to an object by its identifier since this endpoint type is potentially vulnerable to BOLA attacks.

        To specify the PATH parameter identifying an object, use the symbol `*`, e.g.:

        ```bash
        example.com/shops/*/financial_info
        ```

        URI can be configured via the [URI constructor](../../user-guides/rules/add-rule.md#uri-constructor) or [advanced edit form](../../user-guides/rules/add-rule.md#advanced-edit-form) in the trigger creation window.

    * (Optional) [**Application**](../../user-guides/settings/applications.md) to be protected against BOLA attacks and receiving the specified number of requests.

        If you use the same name for several domains, this filter is recommended to point to the application the domain in the **URI** filter is assigned for.

    * (Optional) One or more **IPs** originating the requests.
1. Select trigger reactions:

    * **Mark as BOLA**. Requests exceeding the threshold are marked as a BOLA attack and displayed in the **Attacks** section of Wallarm Console. Wallarm node does NOT block these malicious requests.
    * [**Denylist IP addresses**](../../user-guides/ip-lists/denylist.md) originating malicious requests and the blocking period.
    
        The Wallarm node will block both legitimate and malicious requests (including BOLA attacks) originating from the denylisted IP.
    
    * [**Graylist IP addresses**](../../user-guides/ip-lists/graylist.md) originating  malicious requests and the blocking period.
    
        The Wallarm node will block requests originating from the graylisted IPs only if requests contain [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [the `vpatch`](../../user-guides/rules/vpatch-rule.md) or [custom](../../user-guides/rules/regex-rule.md) attack signs.
        
        !!! info "BOLA attacks originating from graylisted IPs"
            BOLA attacks originating from graylisted IPs are not blocked.
1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually it takes 2-4 minutes).

Example of the trigger to detect and block BOLA attacks aimed at shop financial data (the API endpoint is `https://example.com/shops/{shop_id}/financial_info`):

![BOLA trigger](../../images/user-guides/triggers/trigger-example7.png)

You can configure several triggers with different filters for BOLA protection.

## Automatic BOLA protection for endpoints discovered by API Discovery <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Automatic BOLA protection is available if you use the **[API Discovery](../../about-wallarm/api-discovery.md)** module.

To enable auto protection, proceed to Wallarm Console → **BOLA protection** and turn the switch to the enabled state:

![BOLA trigger](../../images/user-guides/bola-protection/trigger-enabled-state.png)

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

The **BOLA protection** section UI enables you to fine-tune the default Wallarm behavior (including BOLA attack blocking) by [editing the BOLA autodetection template](../../user-guides/bola-protection.md).

## Testing the configuration of BOLA protection

1. Send the number of requests that exceeds the configured threshold to the protected URI. For example, 50 requests with different values of `{shop_id}` to the endpoint `https://example.com/shops/{shop_id}/financial_info`:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/shops/$i/financial_info ; done
    ```
1. If the trigger reaction is **Denylist IP address**, open Wallarm Console → **IP lists** → **Denylist** and check that the source IP address is blocked.

    If the trigger reaction is **Graylist IP address**, check the section **IP lists** → **Graylist** of Wallarm Console.
1. Open the section **Attacks** and check that requests are displayed in the list as BOLA attack.

    ![BOLA attack in the UI](../../images/user-guides/events/bola-attack.png)

    The number of displayed requests corresponds to the number of requests sent after the trigger threshold was exceeded ([more details on detecting behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    To search for BOLA attacks, you can use the `bola` search tag. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).
