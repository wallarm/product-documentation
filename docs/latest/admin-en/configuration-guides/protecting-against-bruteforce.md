# Configuration of brute force protection

There are the following classes of brute‑force attacks:

* Regular brute‑force attacks: password brute‑forcing, session identifier brute‑forcing, credential stuffing
* Forced browsing

Behavioral attacks are characterized by a large number of requests with different forced parameter values sent to a typical URI for a limited timeframe.

[Detailed brute force description →](../../about-wallarm-waf/protecting-against-attacks.md#behavioral-attacks)

!!! warning "Brute force protection restrictions"
    When searching for brute‑force attack signs, Wallarm nodes analyze only HTTP requests that do not contain signs of other attack types. For example, the requests are not considered to be a part of brute‑force attack in the following cases:

    * These requests contain signs of [input validation attacks](../../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks).
    * These requests match the regular expression specified in the [rule **Define a request as an attack based on a regular expression**](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

These instructions provide steps to configure brute force protection.

## Configuration steps

1. Add the [module](../../about-wallarm-waf/subscription-plans.md#modules) **Brute-force protection** to the Wallarm API Security subscription plan. To add the module, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
2. If the filtering node is deployed behind a proxy server or load balancer, then [configure](../using-proxy-or-balancer-en.md) displaying of a real IP address of the client.
3. [Configure](#configuring-the-trigger-to-identify-brute-force) the trigger **Brute force** or **Forced browsing**.
4. [Test](#testing-the-configuration-of-brute-force-protection) the configuration of brute force protection.

## Configuring the trigger to identify brute force

!!! info "Triggers for the number of requests"
    Below is the description of the simplified configuration of brute force protection. Trigger condition **Number of requests** is now replaced with two conditions for different brute‑force attack class detection. Also, setting up the rules **Tag requests as a forced browsing / brute‑force attack** is no longer required.
    
    If the trigger for **Number of requests** and the rules for tagging attacks are configured, they still work but rules cannot be updated or re-created. Nevertheless, we recommend you simplify the current configuration as described below and disable old triggers.

Triggers set the conditions for brute‑force attack detection. Depending on the brute‑force attack class to be detected, you can set up the following conditions:

* **Brute force** to detect regular brute‑force attacks based on the number of requests originated from the same IP address.
* **Forced browsing** to detect the forced browsing attacks based on the number of the 404 response codes returned to the requests having the same origin IP requests.

The steps to configure the trigger are:

1. Open Wallarm Console → section **Triggers** and open the window for trigger creation.
2. Select the condition **Brute force** or **Forced browsing** depending on the brute‑force attack class to be detected.
3. Set the threshold:
   
    * If the trigger condition is **Brute force** - the threshold is for the number of requests originated from the same IP address for a period of time.
    * If the trigger condition is **Forced browsing** - the threshold is for the number of the 404 response codes returned to the requests having the same origin IP requests.
4. If required, specify **URI** to activate the trigger only for requests sent to certain endpoints, for example:
    
    * If you configure password brute‑forcing protection, then specify the URI used for authentication.
    * If you configure protection against the forced browsing attacks, then specify the URI of the resource file directory.
    * If the URI is not specified, the trigger will be activated at any endpoint with the request number exceeding the threshold.

    URI can be configured via the [URI constructor](../../user-guides/rules/add-rule.md#uri-constructor) or [advanced edit form](../../user-guides/rules/add-rule.md#advanced-edit-form) in the trigger creation window.
5. If required, set other trigger filters:

    * **Application** the requests are addressed to.
    * One or more **IP** the requests are sent from.
6. Select trigger reactions:

    * If the trigger condition is **Brute force** - the reaction is **Mark as brute force**. Requests received after the threshold exceedance will be marked as the brute‑force attack and displayed in the **Events** section of Wallarm Console.
    * If the trigger condition is **Forced browsing** - the reaction is **Mark as forced browsing**. Requests received after the threshold exceedance will be marked as the forced browsing attack and displayed in the **Events** section of Wallarm Console.
    * **Blacklist IP address** and the period for IP address blocking to add IP addresses of malicious request sources to the [blacklist](../../user-guides/ip-lists/blacklist.md). The Wallarm node will block all requests originated from the blacklisted IP after the threshold was exceeded.
    * **Greylist IP address** and the period to [greylist](../../user-guides/ip-lists/greylist.md) IP addresses of malicious request sources. The Wallarm node will block requests originated from the greylisted IPs only if requests contain [input validation](../../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), [the `vpatch`](../../user-guides/rules/vpatch-rule.md) or [custom](../../user-guides/rules/regex-rule.md) attack signs. Brute‑force attacks originated from greylisted IPs are not blocked.

Example of the **Brute force** trigger to block the regular brute‑force attacks addressed to `https://example.com/api/v1/login`:

![!Brute force trigger example](../../images/user-guides/triggers/trigger-example6.png)

Description of the provided example and other trigger examples used for brute force protection are available within this [link](../../user-guides/triggers/trigger-examples.md#mark-requests-as-a-bruteforce-attack-if-31-or-more-requests-are-sent-to-the-protected-resource).

You can configure several triggers for brute force protection.

## Testing the configuration of brute force protection

1. Send the number of requests that exceeds the configured threshold to the protected URI. For example, 50 requests to `example.com/api/v1/login`:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/api/v1/login ; done
    ```
2. If the trigger reaction is **Blacklist IP address**, open Wallarm Console → **IP lists** → **Blacklist** and check that source IP address is blocked.

    If the trigger reaction is **Greylist IP address**, check the section **IP lists** → **Greylist** of Wallarm Console.
3. Open the section **Events** and check that requests are displayed in the list as the brute‑force or forced browsing attack.

    ![!Forced browsing attack in the interface](../../images/user-guides/events/dirbust-attack.png)

    The number of displayed requests corresponds to the number of requests sent after the trigger threshold was exceeded ([more details on detecting behavioral attacks](../../about-wallarm-waf/protecting-against-attacks.md#behavioral-attacks)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    To search for attacks, you can use the filters, for example: `dirbust` for the forced browsing attacks, `brute` for the brute‑force attacks. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/0R_2wL5_a-I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
