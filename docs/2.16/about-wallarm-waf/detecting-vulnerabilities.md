# Detecting vulnerabilities

## What is a vulnerability?

A vulnerability is an error made due to negligence or inadequate information when building or implementing a web application that can lead to an information security risk. The information security risks are:

* Unauthorized data access: for example, access to read and modify user data
* Denial of service
* Data corruption and much more

## Vulnerability detection methods

When scanning the application for open vulnerabilities, Wallarm WAF sends requests with attack signs to the protected application address and analyzes application responses. If the response matches one or more pre‑defined vulnerability signs, Wallarm WAF records open vulnerability.

For example: if the response to the request sent to read the `/etc/passwd` contents returns the `/etc/passwd` contents, protected application is vulnerable to the Path Traversal attacks. Wallarm WAF will record the vulnerability with an appropriate type.

To detect vulnerabilities in the application, Wallarm WAF sends requests with attack signs using the following methods:

* **Passive detection**: the vulnerability was found due to the security incident that occurred
* **Active threat verification**: the module **Attack rechecker** automatically replays attacks detected by the WAF node and finds vulnerabilities in the corresponding parts of the application
* **Vulnerability scanner**: all elements of the scope are scanned for typical vulnerabilities

### Passive detection

With passive detection, Wallarm WAF detects a vulnerability due to the security incident that occurred. If an application vulnerability has been exploited during an attack, Wallarm WAF records the security incident and the exploited vulnerability.

Passive vulnerability detection is enabled by default.

### Active threat verification

#### How it works

The module **Attack rechecker** reproduces each attack from the processed traffic. This mechanism allows for the detection of vulnerabilities that could have been exploited during the attack. When reproducing attacks:

* Authentication data (cookies, basic-auth, viewstate) is deleted from the original requests
* Possible attack vectors within the detected attack type are sent in the request

[List of vulnerabilities that can be detected by the module](../attacks-vulns-list.md)

#### Configuration

* The module can be [enabled or disabled](../user-guides/scanner/configure-scanner-modules.md) in the Wallarm Console → **Scanner** section.
* If the WAF node operates in the `block` mode, it is required to [disable blocking of IP addresses](../admin-en/scanner-ips-whitelisting.md) from which the attack rechecker sends requests.
* To add authentication credentials to the requests sent by the attack rechecker, it is required to add a corresponding rule to the application profile. To add a rule, please contact our [technical support](mailto:support@wallarm.com) and send test authentication credentials: API key, token, password or other parameters.

    It is recommended to generate test authentication credentials that will only be used by the Wallarm module **Attack rechecker**.
* To send requests to the separate application instance (staging or test environment), please contact our [technical support](mailto:support@wallarm.com) and send the address of the application instance. By default, requests are sent to the application address from the original request.

### Vulnerability scanner

#### How it works

Vulnerability scanner checks all elements of the company scope for typical vulnerabilities. The scanner sends requests to application addresses from fixed IP addresses and adds the header `X‑Wallarm‑Scanner‑Info` to the requests.

#### Configuration

* The scanner can be [enabled or disabled](../user-guides/scanner/configure-scanner-modules.md) in the Wallarm Console → **Scanner** section. By default, the scanner is enabled
* The list of [vulnerabilities that can be detected](../user-guides/scanner/configure-scanner-modules.md) by the scanner can be configured in the Wallarm Console → **Scanner** section. By default, vulnerability scanner detects all available vulnerabilities
* The [limit of requests sent from the scanner](../user-guides/scanner/configure-scanner.md#scanners-rps-limits) can be configured in the Wallarm Console → **Scanner** section
* If the WAF node operates in the `block` mode, it is required to [disable blocking of IP addresses](../admin-en/scanner-ips-whitelisting.md) from which the scanner sends requests

## False positives

**False positive** occurs when attack signs are detected in the legitimate request or when legitimate entity is qualified as a vulnerability. [More details on false positives in attack detection →](protecting-against-attacks.md#false-positives)

False positives in vulnerability scanning may occur due to the protected application specificities. Similar responses to similar requests may indicate an open vulnerability in one protected application and be expected behavior for another protected application.

If a false positive for a vulnerability is detected, you can add an appropriate mark to the vulnerability in the Wallarm Console. A vulnerability marked as a false positive will be switched to an appropriate status and will not be rechecked. [More about managing false positives via the Wallarm Console →](../user-guides/vulnerabilities/false-vuln.md)

If the detected vulnerability exists in the protected application but cannot be fixed, we recommend setting up the [**Create a virtual patch**](../user-guides/rules/vpatch-rule.md) rule. This rule will allow blocking attacks exploiting the detected type of vulnerability and will eliminate the risk of an incident.

## Managing discovered vulnerabilities

All detected vulnerabilities are displayed in the Wallarm Console → **Vulnerabilities** section. You can manage vulnerabilities through the interface as follows:

* View and analyze vulnerabilities
* Run vulnerability status recheck: still opened or fixed on the application side
* Close vulnerabilities or mark them as false positives

For more information on managing vulnerabilities, see the instructions on [working with vulnerabilities](../user-guides/vulnerabilities/check-vuln.md).

![!Vulnerabilities section](../images/about-wallarm-waf/vulnerabilities-list.png)
