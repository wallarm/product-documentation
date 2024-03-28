# Protection from Multi-Attack Perpetrators

When Wallarm is in [blocking mode](../../admin-en/configure-wallarm-mode.md), it automatically blocks all requests with malicious payloads, letting only legitimate requests through. You can configure additional protection for your applications and API by setting the Wallarm reaction in case if number of different malicious payloads from the same IP (often referred to as **multi-attack perpetrator**) exceeds specified threshold.

Such perpetrators can be automatically placed into the denylist, which starts blocking **all requests from them**, not spending time on analysis of whether they are malicious or not, just basing of the fact that this source produced a lot of malicious requests in the past.

## Configuring

Consider the example below to learn how to configure protection from multi-attack perpetrators.

Let us say you consider that more than 3 malicious payloads per hour from some IP as enough reason to completely block it. To do that, you set the corresponding threshold and instruct the system to block the origin IP for 1 hour.

To provide this protection:

1. Open Wallarm Console → **Triggers** and open the window for trigger creation.
1. Select the **Number of malicious payloads** condition.
1. Set the threshold to `more than 3 malicious requests from the same IP per hour`.

    !!! info "What is not counted"
        The experimental payloads based on the [custom regular expressions](../../user-guides/rules/regex-rule.md).
        
1. Do not set any filters, but be aware that in other cases you can use separately or combined:

    * **Type** is a [type](../../attacks-vulns-list.md) of attack detected in the request or a type of vulnerability the request is directed to.
    * **Application** is the [application](../../user-guides/settings/applications.md) that receives the request or in which an incident is detected.
    * **IP** is an IP address from which the request is sent. The filter expects only single IPs, it does not allow subnets, locations and source types.
    * **Domain** is the domain that receives the request or in which an incident is detected.
    * **Response status** is the response code returned to the request.

1. Select the **Denylist IP address** - `Block for 1 hour` trigger reaction. Wallarm will put origin IP to the [denylist](../../user-guides/ip-lists/overview.md) after the threshold is exceeded and block all further requests from it.

    ![Default trigger](../../images/user-guides/triggers/trigger-example-default.png)
        
1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually it takes 2-4 minutes).

## Pre-configured trigger

New company accounts are featured by the pre-configured (default) **Number of malicious payloads** trigger which graylists IP for 1 hour when it originates more than 3 different [malicious payloads](../../glossary-en.md#malicious-payload) within 1 hour.

[Graylist](../../user-guides/ip-lists/overview.md) is a list of suspicious IP addresses processed by the node as follows: if graylisted IP originates malicious requests, the node blocks them while allowing legitimate requests. In contrast to graylist, [denylist](../../user-guides/ip-lists/overview.md) points to IP addresses that are not allowed to reach your applications at all - the node blocks even legitimate traffic produced by denylisted sources. IP graylisting is one of the options aimed at the reduction of [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives).

The trigger is released in any node filtration mode, so that it will graylist IPs regardless of the node mode.

However, the node analyzes the graylist only in the **safe blocking** mode. To block malicious requests originating from graylisted IPs, switch the node [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) to safe blocking learning its features first.

The hits with the Brute force, Forced browsing, Resource overlimit, Data bomb, or Virtual patch attack types are not considered in this trigger.

You can temporary disable, modify or delete the default trigger.

## Testing

The following is the testing example for the [pre-configured trigger](#pre-configured-trigger). You can adjust it to your trigger view.

1. Send the following requests to the protected resource:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    There are 4 malicious payloads of the [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal) types.
1. Open Wallarm Console → **IP lists** → **Graylist** and check that the IP address from which the requests originated is graylisted for 1 hour.
1. Open the section **Attacks** and check that the attacks are displayed in the list:

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    To search for the attacks, you can use the `multiple_payloads` [search tag](../../user-guides/search-and-filters/use-search.md#search-by-attack-type).
