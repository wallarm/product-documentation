[cwe-78]:   https://cwe.mitre.org/data/definitions/78.html
[cwe-94]:   https://cwe.mitre.org/data/definitions/94.html

#   Security Issue (Vulnerability) Types

This article lists vulnerabilities that Wallarm can detect including those presented in the [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP API Top 10](https://owasp.org/www-project-api-security/) security risk lists.

## Which tools to use

TBD

## Vulnerabilities

### RCE

**Full name:** remote code execution

**CWE codes:** [CWE-78][cwe-78], [CWE-94][cwe-94] and others

**Wallarm code:** `rce`

**Description:**

An attacker can inject malicious code into a request to your API, and this script will be executed on a server. Also, the attacker can try to execute certain commands for the operating system that the vulnerable application runs on. 

Provided that an RCE attack is successful, an attacker can perform a wide range of actions, including:

*   Compromising the confidentiality, accessibility, and integrity of the vulnerable data.
*   Taking control of the operating system and the server that the application runs on.
*   Other possible actions.

This vulnerability occurs due to incorrect validation and parsing of user input.

[**Detected by:**](about-wallarm/detecting-vulnerabilities.md#detection-methods) 

* With node: [passive detection](about-wallarm/detecting-vulnerabilities.md#detection-methods), [Threat Replay Testing](vulnerability-detection/threat-replay-testing/overview.md)
* Without node: [AASM](api-attack-surface/overview.md)