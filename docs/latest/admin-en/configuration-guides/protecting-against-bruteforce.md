# Brute Force Protection

A brute force attack is one of the attack types not detected by Wallarm out-of-the-box, its detection should be appropriately configured as this guide describes.

[Regular brute force attacks](../../attacks-vulns-list.md#brute-force-attack) include password brute forcing, session identifier brute forcing, and credential stuffing. These attacks are characterized by a large number of requests with different forced parameter values sent to a typical URI for a limited timeframe.

## Basic protection

!!! info "Availability"
    If [advanced protection](#advanced-protection) tools are enabled for you as a part of Advanced API Security [subscription](../../about-wallarm/subscription-plans.md#waap-and-advanced-api-security), basic protection controls may be unavailable. If you want to enable them, contact the [Wallarm support team](https://support.wallarm.com/).

Brute force protection described in this section is one of the ways for the basic load control provided by Wallarm. Alternatively, you can apply [rate limiting](../../user-guides/rules/rate-limiting.md). Use rate limiting to slow the incoming traffic and brute force protection to completely block the attacker.

Besides basic brute force protection, you can configure basic protection against [forced browsing](protecting-against-forcedbrowsing.md) similarly.

### Configuring

Consider the example below to learn how to configure brute force protection with triggers.

Let us say you want to prevent malicious actors from trying various passwords to gain authorized access to your `rent-car` application via its authentication endpoints (brute force attack). To provide this protection, for your authentication endpoints, you can limit number of requests per time interval, and set to block IPs exceeding this limit:

1. Open Wallarm Console → **Triggers** and open the window for trigger creation.
1. Select the **Brute force** condition.
1. Set the threshold of 30 requests from the same IP per 30 seconds.

    Note that these are the example values - when configuring trigger for your own traffic, you should define a threshold considering your legitimate usage statistics.
    
    !!! info "Allowed threshold time periods"
        When adjusting the threshold time period, the value must be a multiple of 30 seconds or 10 minutes, depending on the selected unit.

1. Set the **Application** filter to `rent-car` (the application should be [registered](../../user-guides/settings/applications.md) in Wallarm).
1. Set the **URI** filter as displayed on the screenshot, including:

    * `**` [wildcard](../../user-guides/rules/rules.md#using-wildcards) in the path meaning "any number of components"
    * `.*login*` [regular expression](../../user-guides/rules/rules.md#condition-type-regex) in the request part meaning "endpoint contains `login`"

        Combined, they cover, for example:
        `https://rent-car-example.com/users/login`
        `https://rentappc-example.com/usrs/us/p-login/sq`
        (note that for entire trigger to work, domains should be [linked](../../user-guides/settings/applications.md#automatic-application-identification) to selected application)

        ![Brute force trigger example](../../images/user-guides/triggers/trigger-example6-4.8.png)
    
    * Besides configuring the pattern we need in this example, you can enter specific URIs or set trigger to work at any endpoint by not specifying any URI.
    * If using nested URIs, consider [trigger processing priorities](../../user-guides/triggers/triggers.md#trigger-processing-priorities).

1. Do not use the **IP** filter in this case, but be aware that you can use it to set triggers only to react to specific IPs originating requests.
1. Select the **Denylist IP address** - `Block for 1 hour` trigger reaction. Wallarm will put origin IP to the [denylist](../../user-guides/ip-lists/overview.md) after the threshold is exceeded and block all further requests from it.

    Note that even if the bot IP is placed into the denylist by brute force protection, by default, Wallarm collects and [displays](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) statistics regarding blocked requests originating from it.

1. Select the **Mark as brute force** trigger reaction. Requests received after exceeding the threshold will be marked as the brute force attack and displayed in the **Attacks** section of Wallarm Console. In some cases, you can use this reaction alone to have information about the attack, but not to block anything.
1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually, it takes 2-4 minutes).

You can configure several triggers for brute force protection.

### Testing

!!! info "Testing in your environment"
    To test the **Brute force** trigger in your environment, in the trigger and the requests below, replace the domain with any public one (e.g. `example.com`). Set your own [application](../../user-guides/settings/applications.md) and link the domain to it.

To test the trigger described in the [Configuring](#configuring) section:

1. Ensure that the `rent-car-example.com` domain is [identified](../../user-guides/settings/applications.md#automatic-application-identification) as part of the `rent-car` application registered in Wallarm.
1. Send the number of requests that exceeds the configured threshold to the protected endpoint of this domain. For example, 50 requests to `rent-car-example.com/users/login`:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://rent-car-example.com/users/login ; done
    ```
1. Open Wallarm Console → **IP lists** → **Denylist** and check that source IP address is blocked.
1. Open the **Attacks** section and check that requests are displayed in the list as a brute force attack.

    ![Brute force attack in the interface](../../images/user-guides/events/brute-force-attack.png)

    The number of displayed requests corresponds to the number of requests sent after exceeding the trigger threshold ([more details on detecting behavioral attacks](../../attacks-vulns-list.md#attack-types)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/grouping-sampling.md#sampling-of-hits)).

    To search for brute force attacks, you can use the `brute` filter. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

### Requirements and restrictions

**Requirements**

To protect resources from brute force attacks, real clients' IP addresses are required. If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying real clients' IP addresses.

**Restrictions**

When searching for brute force attack signs, Wallarm nodes analyze only HTTP requests that do not contain signs of other attack types.

## Advanced protection <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's Advanced API Security [subscription](../../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) provides [advanced configuration](../../api-protection/enumeration-attack-protection.md) of brute force protection.
