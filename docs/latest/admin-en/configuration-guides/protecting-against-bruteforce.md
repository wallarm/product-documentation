# Configuration of brute force protection

There are the following classes of brute‑force attacks:

* Passwords brute‑forcing
* Session identifiers brute‑forcing
* Forced browsing (dirbust)
* Credential stuffing

Behavioral attacks are characterized by a large number of requests with different forced parameter values sent to a typical URL for a limited timeframe.

[Detailed brute force description →](../../about-wallarm-waf/protecting-against-attacks.md#behavioral-attacks)

!!! warning "Brute force protection restrictions"
    When searching for brute‑force attack signs, Wallarm WAF analyzes only HTTP requests that do not contain signs of other attack types. For example, the requests are not considered to be a part of brute-force attack in the following cases:

    * These requests contain signs of [input validation attacks](../../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks).
    * These requests match the regular expression specified in the [rule **Define a request as an attack based on a regular expression**](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

These instructions provide steps to configure brute force protection.

## Configuration steps

1. Add the [module](../../about-wallarm-waf/subscription-plans.md#modules) **Brute-force protection** to the Wallarm WAF subscription plan. To add the module, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
2. If the WAF node is deployed behind a proxy server or load balancer, then [configure](../using-proxy-or-balancer-en.md) displaying of a real IP address of the client.
3. [Configure](#configuring-the-trigger-to-identify-brute-force) the trigger **Mark as brute force/dirbust**.
4. [Test](#testing-the-configuration-of-brute-force-protection) the configuration of brute force protection.

## Configuring the trigger to identify brute force

1. Open the Wallarm Console → section **Triggers** and open the window for trigger creation.
2. Select the condition **Number of requests** and set the request number threshold or leave the default threshold value.
   
    * If the threshold is exceeded, then the requests will be marked as brute‑force attack.
    * If the threshold is exceeded and the code 404 is returned in the response to all requests, then the requests will be marked as dirbust (forced browsing) attack.
3. Set the URL to filter all incoming requests by this URL and activate the trigger:
    
    * If you configure password brute‑forcing protection, then set the URL used for authentication.
    * If you configure dirbust protection, then set the URL of resource file directory.

    URL can be set in one of the following ways:

    * Via the [rule defining attack counter](../../user-guides/rules/define-counters.md) for any port listening for incoming requests. The created counter should be selected in the trigger filter **Counter name**.
    * Via the **URL** trigger filter if the protected resource listens for incoming requests on port other than 80 or 443. The value should correspond to the format `host:port/path` (for example: `example.com:8888/api/frontend/login`).
4. If required, set other trigger filters:

    * **Application** the requests are addressed to.
    * One or more **IP** the requests are sent from.
5. Select trigger reactions:

    * **Mark as brute force/dirbust** to mark requests sent after the threshold was exceeded as the brute‑force or dirbust attack. Requests will be marked as an attack but will not be blocked. To block requests, it is required to select one more reaction **Blacklist IP address**.
    * **Blacklist IP address** and the period for IP address blocking to add IP addresses from which malicious requests were originated to the blacklist. All requests sent after the threshold was exceeded will be blocked by the WAF node.

Example of a configured rule defining attack counter and trigger:

![!Brute force/dirbust trigger example](../../images/user-guides/triggers/trigger-example6.png)

Description of the provided example and other trigger examples used for brute force protection is available within this [link](../../user-guides/triggers/trigger-examples.md#mark-requests-as-a-bruteforce-or-dirbust-attack-if-31-or-more-requests-were-sent-to-the-protected-resource).

You can configure several triggers for brute force protection.

## Testing the configuration of brute force protection

1. Send the number of requests that exceeds the configured threshold to the protected URL. For example, 50 requests to `example.com/api/frontend/login`:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/api/frontend/login ; done
    ```
2. Open the Wallarm Console → section **Blacklist** and check that IP address from which the requests were originated is blocked for the period configured in the trigger.
3. Open the section **Events** and check that requests are displayed in the list as the brute‑force or dirbust attack.

    ![!Dirbust attack in the interface](../../images/user-guides/events/dirbust-attack.png)

    The number of displayed requests corresponds to the number of requests sent after the trigger threshold was exceeded ([more details on detecting behavioral attacks](../../about-wallarm-waf/protecting-against-attacks.md#behavioral-attacks)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/analyze-attack.md#sampling-of-requests-in-bruteforce-attacks)).

    To search for attacks, you can use the filters, for example: `dirbust` for dirbust attacks, `brute` for brute‑force attacks. All filters are described in the [instructions on search using](../../user-guides/search-and-filters/use-search.md).

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/0R_2wL5_a-I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
