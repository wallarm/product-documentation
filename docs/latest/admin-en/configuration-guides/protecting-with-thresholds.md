# Generic Protection from Malicious Payloads

You can configure additional protection for your applications and API by setting the Wallarm reaction in case if number of [malicious payloads](../../glossary-en.md#malicious-payload) exceeds specified threshold.

## Configuring

To configure protection from sources originating malicious requests:

1. Open Wallarm Console → section **Triggers** and open the window for trigger creation.
1. Select the **Number of malicious payloads** condition.
1. Set the threshold per time interval.
1. If required, set one or several filters:

    * **Type** is a [type](../../attacks-vulns-list.md) of attack detected in the request or a type of vulnerability the request is directed to.
    * **Application** is the [application](../settings/applications.md) that receives the request or in which an incident is detected.
    * **IP** is an IP address from which the request is sent.

        The filter expects only single IPs, it does not allow subnets, locations and source types.
    * **Domain** is the domain that receives the request or in which an incident is detected.
    * **Response status** is the response code returned to the request.
    * **Target** is an application architecture part that the attack is directed at or in which the incident is detected. It can take the following values: `Server`, `Client`, `Database`.

1. Select trigger reactions:

    * [**Denylist IP address**](../../user-guides/ip-lists/denylist.md) originating malicious requests and the blocking period.
    
        The Wallarm node will block both legitimate and malicious requests originating from the denylisted IP.
    
    * [**Graylist IP address**](../../user-guides/ip-lists/graylist.md) originating  malicious requests and the blocking period.
    
        The Wallarm node will block requests originating from the graylisted IPs only if requests contain [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [the `vpatch`](../../user-guides/rules/vpatch-rule.md) or [custom](../../user-guides/rules/regex-rule.md) attack signs.
        
1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually it takes 2-4 minutes).

## Pre-configured trigger

New company accounts are featured by the pre-configured (default) **Number of malicious payloads** trigger which graylists IP for 1 hour when it originates more than 3 different [malicious payloads](../../glossary-en.md#malicious-payload) within 1 hour

[Graylist](../ip-lists/graylist.md) is a list of suspicious IP addresses processed by the node as follows: if graylisted IP originates malicious requests, the node blocks them while allowing legitimate requests. In contrast to graylist, [denylist](../ip-lists/denylist.md) points to IP addresses that are not allowed to reach your applications at all - the node blocks even legitimate traffic produced by denylisted sources. IP graylisting is one of the options aimed at the reduction of [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives).

The trigger is released in any node filtration mode, so that it will graylist IPs regardless of the node mode.

However, the node analyzes the graylist only in the **safe blocking** mode. To block malicious requests originating from graylisted IPs, switch the node [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) to safe blocking learning its features first.

The hits with the Brute force, Forced browsing, Resource overlimit, Data bomb, or Virtual patch attack types are not considered in this trigger.

!!! info "Modifying default trigger"
    You can temporary disable, modify or delete the default trigger.

## Examples

### Graylist IP if 4 or more malicious payloads are detected in 1 hour

If 4 or more different malicious payloads are sent to the protected resource from one IP address, this IP address will be graylisted for 1 hour for all applications in a Wallarm account.

If you have recently created the Wallarm account, this [trigger is already created and enabled](triggers.md#pre-configured-triggers-default-triggers). You can edit, disable, delete, or copy this trigger as well as the manually created triggers.

![Graylisting trigger](../../images/user-guides/triggers/trigger-example-graylist.png)

**To test the trigger:**

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

    To search for attacks, you can use the filters, for example: `sqli` for the [SQLi](../../attacks-vulns-list.md#sql-injection) attacks, `xss` for the [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks, `ptrav` for the [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

The trigger is released in any node filtration mode, so that it will graylist IPs regardless of the node mode. However, the node analyzes the graylist only in the **safe blocking** mode. To block malicious requests originating from graylisted IPs, switch the node [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) to safe blocking learning its features first.

### Denylist IP if 4 or more malicious payloads are detected in 1 hour

If 4 or more different [malicious payloads](../../glossary-en.md#malicious-payload) are sent to the protected resource from one IP address, this IP address will be denylisted for 1 hour for all applications in a Wallarm account.

![Default trigger](../../images/user-guides/triggers/trigger-example-default.png)

**To test the trigger:**

1. Send the following requests to the protected resource:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    There are 4 malicious payloads of the [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal) types.
2. Open Wallarm Console → **IP lists** → **Denylist** and check that the IP address from which the requests originated is blocked for 1 hour.
1. Open the section **Attacks** and check that the attacks are displayed in the list:

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    To search for attacks, you can use the filters, for example: `sqli` for the [SQLi](../../attacks-vulns-list.md#sql-injection) attacks, `xss` for the [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks, `ptrav` for the [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

If an IP address was denylisted by this trigger, the filtering node would block all malicious and legitimate requests that originated from this IP. To allow legitimate requests, you can configure the [graylisting trigger](#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).

