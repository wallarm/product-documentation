# Detecting vulnerabilities

## What is a vulnerability?

A vulnerability is an error made due to negligence or inadequate information when building or implementing a web application that can lead to an information security risk. The information security risks are:

* Unauthorized data access: for example, access to read and modify user data
* Denial of service
* Data corruption and much more

A vulnerability is not a characteristic of the Internet. A vulnerability is a characteristic of your system. Whether or not you have vulnerabilities does not depend on your Internet traffic. The Internet traffic, however, can be used to detect the vulnerabilities.

## Vulnerability detection methods

To detect vulnerabilities in the application, Wallarm WAF uses the following methods:

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

## Managing discovered vulnerabilities

All detected vulnerabilities are displayed in the Wallarm Console → **Vulnerabilities** section. You can manage vulnerabilities through the interface as follows:

* View and analyze vulnerabilities
* Run vulnerability status recheck: still opened or fixed on the application side
* Close vulnerabilities or mark them as false positives

For more information on managing vulnerabilities, see the instructions on [working with vulnerabilities](../user-guides/vulnerabilities/check-vuln.md).

![!Vulnerabilities section](../images/about-wallarm-waf/vulnerabilities-list.png)
