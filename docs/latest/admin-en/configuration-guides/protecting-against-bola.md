# Configuration of BOLA (IDOR) protection

Behavioral attacks such as [Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) exploit the vulnerability of the same name. This vulnerability allows an attacker to access an object by its identifier via an API request and either get or modify its data bypassing an authorization mechanism. This article instructs you on protecting your applications against the BOLA attacks.

By default, Wallarm automatically discovers only vulnerabilities of the BOLA type (also known as IDOR) but does not detect its exploitation attempts.

You have the following options to detect and block the BOLA attacks with Wallarm:

* [Manual creation of the **BOLA** trigger](#manual-creation-of-bola-trigger)
* [Using the API Discovery module with the automatic BOLA protection enabled](#using-api-discovery-with-automatic-bola-protection-enabled)

!!! warning "BOLA protection restrictions"
    Only Wallarm node 4.2 and above supports the BOLA attack detection.

    Wallarm node 4.2 and above analyzes only the following requests for the BOLA attack signs:

    * Requests sent via the HTTP protocol.
    * Requests that do not contain signs of other attack types, e.g. requests are not considered to be the BOLA attack if:

        * These requests contain signs of [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks).
        * These requests match the regular expression specified in the [rule **Create regexp-based attack indicator**](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

## Manual creation of BOLA trigger

### Configuration steps

1. If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying of a real IP address of the client.
1. [Configure](#configuring-the-trigger-to-identify-the-bola-attacks) the **BOLA** trigger.
1. [Test](#testing-the-configuration-of-bola-protection) the configuration of BOLA protection.

### Configuring the trigger to identify the BOLA attacks

For the Wallarm node to identify the BOLA attacks:

1. Open Wallarm Console → **Triggers** and proceed to the **BOLA** trigger setup.
1. Set the conditions for defining requests as the BOLA attack:

    * The number of **Requests from the same IP** for a period of time.
    * **URI** that should be protected against the BOLA attacks and to which the specified number of requests should be sent. The value should be an API endpoint pointing to an object by its identifier since this endpoint type is potentially vulnerable to the BOLA attacks.

        To specify the PATH parameter identifying an object, use the symbol `*`, e.g.:

        ```bash
        example.com/shops/*/financial_info
        ```

        URI can be configured via the [URI constructor](../../user-guides/rules/add-rule.md#uri-constructor) or [advanced edit form](../../user-guides/rules/add-rule.md#advanced-edit-form) in the trigger creation window.

    * (Optional) [**Application**](../../user-guides/settings/applications.md) that should be protected against the BOLA attacks and to which the specified number of requests should be sent.

        If you use the same name for several domains, this filter is recommended to point to an application the domain in the **URI** filter is assigned for.

    * (Optional) One or more **IPs** the requests are sent from.
6. Select trigger reactions:

    * **Mark as BOLA**. Requests received after the threshold exceedance will be marked as the BOLA attack and displayed in the **Events** section of Wallarm Console. Wallarm node will NOT block these malicious requests.
    * **Denylist IP address** and the period for IP address blocking to add IP addresses of malicious request sources to the [denylist](../../user-guides/ip-lists/denylist.md).
    
        The Wallarm node will block both legitimate and malicious requests (including the BOLA attacks) originating from the denylisted IP.
    
    * **Graylist IP address** and the period to [graylist](../../user-guides/ip-lists/graylist.md) IP addresses of malicious request sources.
    
        The Wallarm node will block requests originating from the graylisted IPs only if requests contain [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [the `vpatch`](../../user-guides/rules/vpatch-rule.md) or [custom](../../user-guides/rules/regex-rule.md) attack signs.
        
        !!! info "BOLA attack originating from graylisted IPs"
            The BOLA attacks originating from graylisted IPs are not blocked.
1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually it takes 2-4 minutes).

Example of a trigger to detect and block BOLA attacks aimed at shop financial data (the API endpoint is `https://example.com/shops/{shop_id}/financial_info`):

![!BOLA trigger](../../images/user-guides/triggers/trigger-example7.png)

You can configure several triggers with different filters for BOLA protection.

## Using API Discovery with automatic BOLA protection enabled

The **[API Discovery](../../about-wallarm-waf/api-discovery.md)** module is able to automatically create the BOLA [triggers](../../user-guides/triggers/triggers.md).

### Enabling API Discovery automatic BOLA protection

To enable the API Discovery automatic BOLA protection:

1. Make sure you have API Discovery subscription and Wallarm node 4.2 or above.
1. Contact the [Wallarm support team](mailto:support@wallarm.com) to do one of the following:

    * Request automatic BOLA protection for API Discovery.
    * Discuss or modify automatic BOLA protection configuration. The following may be configured:
        * Parameters for triggers creation:
        
            * Number of nesting levels in the endpoint, e.g. `domain.com/path1/path2/path3/path4` (variable PATH parameters are also considered to be nesting levels, e.g. `domain.com/path1/path2/path3/{variative_path4}`). From all endpoints  that the API Discovery finds, it will consider only those with a level not lower than the specified and there is at least one variability Default value is `3`.
            * To optimize the operation of the node and maintain a balance of load and protection level, a trigger will be created for the specified number of endpoints that are most likely to be the target of a BOLA. Default value is `50`.

        * Parameters to be set within created triggers:

            * Condition: the number of requests from the same IP per interval of time the endpoint receives. Default value is `50` requests per `30` seconds.
            * Reaction: default (`Mark as BOLA`) may be extended or replaced with [graylisting](../../user-guides/ip-lists/graylist.md) or [denylisting](../../user-guides/ip-lists/denylist.md) for the period of time.

### Viewing list of automatically created BOLA protection triggers

To view the list of automatically created BOLA protection triggers, in the Wallarm Console → **Triggers** section, click **Automatically generated**.

You cannot change the auto-created BOLA triggers, they are read-only. In contrast, [manually](#manual-creation-of-bola-trigger) created BOLA triggers can be edited.

### Reaction to changes in API Structure

BOLA automatic protection reacts to the [changes in API Structure](../../user-guides/api-discovery.md#tracking-changes-in-api-structure):

* For the new endpoints, if they meet the [conditions](#using-api-discovery-with-automatic-bola-protection-enabled), the new BOLA trigger will be created.
* If the endpoint with the BOLA protection trigger is removed, the corresponding BOLA trigger is deleted.

### Disabling API Discovery automatic BOLA protection

In the following cases:

* You API Discovery [subscription](../../about-wallarm-waf/subscription-plans.md) has expired.
* In response to your request, the Wallarm support team has disabled the automatic BOLA protection for API Discovery.

All the automatically created BOLA protection triggers will be deleted. The automatic API Discovery BOLA protection will stop.

## Testing the configuration of BOLA protection

1. Send the number of requests that exceeds the configured threshold to the protected URI. For example, 50 requests with different values of `{shop_id}` to the endpoint `https://example.com/shops/{shop_id}/financial_info`:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/shops/$i/financial_info ; done
    ```
1. If the trigger reaction is **Denylist IP address**, open Wallarm Console → **IP lists** → **Denylist** and check that the source IP address is blocked.

    If the trigger reaction is **Graylist IP address**, check the section **IP lists** → **Graylist** of Wallarm Console.
1. Open the section **Events** and check that requests are displayed in the list as the BOLA attack.

    ![!BOLA attack in the UI](../../images/user-guides/events/bola-attack.png)

    The number of displayed requests corresponds to the number of requests sent after the trigger threshold was exceeded ([more details on detecting behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    To search for the BOLA attacks, you can use the `bola` search tag. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).
