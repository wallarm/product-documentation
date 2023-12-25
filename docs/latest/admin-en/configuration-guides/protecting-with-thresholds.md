# Protection from Multi-Attack Perpetrators

When Wallarm is in [blocking mode](../../admin-en/configure-wallarm-mode.md), it automatically blocks all requests with malicious payloads, letting only legitimate requests through. You can configure additional protection for your applications and API by setting the Wallarm reaction in case if number of malicious payloads from the same IP (often referred to as **multi-attack perpetrator**) exceeds specified threshold.

Such perpetrators can be automatically placed into the denylist, which starts blocking **all requests from them**, not spending time on analysis of whether they are malicious or not, just basing of the fact that this source produced a lot of malicious requests in the past.

## Configuring

To configure protection from sources originating malicious requests:

1. Open Wallarm Console → **Triggers** and open the window for trigger creation.
1. Select the **Number of malicious payloads** condition.
1. Set number of different malicious payloads from one IP per time interval. On exceeding this number within the specified time, the trigger will be activated.
1. If required, set one or several filters:

    * **Type** is a [type](../../attacks-vulns-list.md) of attack detected in the request or a type of vulnerability the request is directed to.
    * **Application** is the [application](../../user-guides/settings/applications.md) that receives the request or in which an incident is detected.
    * **IP** is an IP address from which the request is sent.

        The filter expects only single IPs, it does not allow subnets, locations and source types.

    * **Domain** is the domain that receives the request or in which an incident is detected.
    * **Response status** is the response code returned to the request.
    * **Target** is an application architecture part that the attack is directed at or in which the incident is detected. It can take the following values: `Server`, `Client`, `Database`.

1. Select trigger reactions:

    * [**Denylist IP address**](../../user-guides/ip-lists/overview.md) originating malicious requests and the blocking period.
    
        The Wallarm node will block both legitimate and malicious requests originating from the denylisted IP.
    
    * [**Graylist IP address**](../../user-guides/ip-lists/overview.md) originating  malicious requests and the blocking period.
    
        The Wallarm node will block requests originating from the graylisted IPs only if requests contain [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [the `vpatch`](../../user-guides/rules/vpatch-rule.md) or [custom](../../user-guides/rules/regex-rule.md) attack signs.

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

Use [pre-configured trigger](#pre-configured-trigger) for testing. To test:

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
