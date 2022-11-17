# IP address denylist

**Denylist** is a list of IP addresses that are not allowed to access your applications even if originating legitimate requests. The filtering node in any [mode](../../admin-en/configure-wallarm-mode.md) blocks all requests originated from denylisted IP addresses (unless IPs are duplicated in the [allowlist](allowlist.md)).

In the Wallarm Console → **IP lists** → **Denylist**, you can manage blocked IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![!IP denylist](../../images/user-guides/ip-lists/denylist-apps.png)

!!! info "Old name of the list"
    The old name of the IP address denylist is "IP address blacklist".

## Examples of IP denylist usage

* Block IP addresses from which several consecutive attacks originated.

    An attack may include several requests originating from one IP address and containing malicious payloads of different types. One of the methods to block such attacks is to block requests origin. You can configure automatic source IP blocking by configuring the threshold for source IP blocking and appropriate reaction in the [trigger](../triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).
* Block behavioral-based attacks.

    The Wallarm filtering node can block most harmful traffic request-by-request if a malicious payload is detected. However, for behavioral‑based attacks when every single request is legitimate (e.g. login attempts with username/password pairs) blocking by origin might be necessary.

    By default, automatic blocking of behavioral attack sources is disabled. [Instructions on configuring brute force protection →](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-steps)

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
