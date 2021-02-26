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

* **Passive detection**: the vulnerability was found due to the security incident that occurred.
* **Active threat verification** with the main component **Attack rechecker** lets you turn attackers into penetration testers and discover possible security issues from their activity as they probe your apps/APIs for vulnerabilities. The module **Attack rechecker** finds possible vulnerabilities by probing application endpoints using real attack data from the traffic.
* **Vulnerability scanner**: all elements of the scope are scanned for typical vulnerabilities.

### Passive detection

With passive detection, Wallarm WAF detects a vulnerability due to the security incident that occurred. If an application vulnerability has been exploited during an attack, Wallarm WAF records the security incident and the exploited vulnerability.

Passive vulnerability detection is enabled by default.

### Active threat verification

#### How it works

Based on the initial detected attacks, **Attack rechecker** creates a lot of new test requests with different payloads attacking the same endpoint. This mechanism allows Wallarm to detect vulnerabilities that could be potentially exploited during attacks. The **Attack rechecker** process will either confirm that the application is not vulnerable to the specific attack vectors or find actual application security issues.

[List of vulnerabilities that can be detected by the module](../attacks-vulns-list.md)

The **Attack rechecker** process uses the following logic to check the protected application for possible Web and API security vulnerabilities:

1. For every malicious request detected by a Wallarm WAF node and uploaded to the connected Wallarm Cloud, the system analyzes which specific endpoint (URL, request string parameter, JSON attribute, XML field, etc) was attacked and which specific kind of vulnerability (SQLi, RCE, XSS, etc) the attacker was trying to exploit. For example, let's take a look at the following malicious GET request:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    From the request the system will learn the following details:
    
    * The attacked URL is `https://example.com/login`
    * The type of used attack is SQLi (according to the `UNION SELECT username, password` payload)
    * The attacked GET request parameter is `user`
    * Additional piece of information provided in the request is request string parameter `token=IyEvYmluL3NoCg` (it is probably used by the application to authenticate the user)
2. Using the collected information the **Attack rechecker** module will create a list of about 100-150 test requests to the originally targeted endpoint but with different types of malicious payloads for the same type of attack (like SQLi). For example:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=1')+WAITFOR+DELAY+'0 indexpt'+AND+('wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+SLEEP(10)--+wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1);SELECT+PG_SLEEP(10)--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1'+OR+SLEEP(10)+AND+'wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+1=(SELECT+1+FROM+PG_SLEEP(10))
    https://example.com/login?token=IyEvYmluL3NoCg&user=%23'%23\x22%0a-sleep(10)%23
    https://example.com/login?token=IyEvYmluL3NoCg&user=1';+WAITFOR+DELAY+'0code:10'--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1%27%29+OR+SLEEP%280%29+AND+%28%27wlrm%27%3D%27wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=SLEEP(10)/*'XOR(SLEEP(10))OR'|\x22XOR(SLEEP(10))OR\x22*/
    ```
3. The **Attack rechecker** module will send generated test requests to the application bypassing the WAF protection (using the [white-listing feature](#configure-proper-white-listing-rules-for-scanner-ip-addresses)) and verify that the application at the specific endpoint is not vulnerable to the specific attack type. If **Attack rechecker** suspects that the application has an actual security vulnerability, it will create an event with type [incident](../user-guides/events/check-attack.md#incidents).

    !!! info "`User-Agent` HTTPS header value in Attack rechecker requests"
        The `User-Agent` HTTP header in **Attack rechecker** requests will have the value `Wallarm attack-rechecker (v1.x)`.
4. Detected security incidents are reported in the Wallarm Console and are able to be dispatched to your security team via available third-party [Integrations](../user-guides/settings/integrations/integrations-intro.md) and [Triggers](../user-guides/triggers/triggers.md).

#### Know potential risks from the Attack rechecker activity

In rare cases when a legitimate request is detected by the WAF as an attack, the request will be replayed by **Attack rechecker**. If the request is not idempotent (for example, an authenticated request creating a new object in the application), then the **Attack rechecker** requests may create many new unwanted objects in the user account or perform other unexpected operations.

To minimize the risk of the described situation, **Attack rechecker** will automatically strip the following HTTP headers from the replayed requests:

* `Cookie`
* `Authorization: Basic`
* `Viewstate`

#### Configure proper data masking rules

If your application uses non-standard types of authentication (for example, request string token or custom HTTP request header or JSON attribute in POST body), then you should configure a proper [data masking rule](../user-guides/rules/sensitive-data-rule.md) to prevent the WAF nodes from sending the information to the Wallarm Cloud. In this case, the replayed **Attack rechecker** requests will be not authorized by the application and not cause any harm to the system.

#### Know how to control the Attack rechecker

The global on/off switch of the **Attack rechecker** module is located in the Wallarm Console → [**Scanner** section](../user-guides/scanner/configure-scanner-modules.md).

#### Configure proper white-listing rules for scanner IP addresses

The configuration is required for the **Attack rechecker** module to reach the tested application without getting their requests blocked by the WAF nodes.

* [Instructions for NGINX-based WAF nodes](../admin-en/scanner-ips-whitelisting.md) (including AWS / GCP / Yandex.Cloud images, Docker node container)
* [Instructions for the WAF nodes deployed as the Wallarm Kubernetes Ingress controller](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/whitelist-wallarm-ip-addresses.md)
* Instructions for Kubernetes sidecar deployments based on [Helm charts](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm.md) or [Manifests](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container-manifest.md)

The **Attack rechecker** functionality will not work if its IP addresses are not properly white-listed.

#### Configure proper notification and escalation rules for detected security incidents

Wallarm provides [integrations with third-party messaging and incident management services](../user-guides/settings/integrations/integrations-intro.md) like Slack, PagerDuty, Opsgenie, Telegram and others. It is highly recommended to configure your Wallarm Cloud instance to use the integrations to dispatch notifications about discovered security incidents to your information security team.

#### Know how to handle potential leaks of sensitive data from WAF nodes to the Wallarm Cloud

If you discover that your WAF nodes have dispatched some detected false positive requests with included sensitive information such as authentication tokens or username/password credentials to the Wallarm Cloud, you can ask the [Wallarm technical support](mailto:support@wallarm.com) to delete the requests from the Wallarm Cloud storage. Also, you can configure proper [data masking rules](../user-guides/rules/sensitive-data-rule.md). It is not possible to modify already stored data.

#### Optional: Enable/disable Attack rechecker tests for specific applications, domains or URLs

If some application endpoints are not idempotent and don’t use any request authentication mechanism (for example, the self-registration of a new customer account) it is recommended to disable the **Attack rechecker** feature for the specific endpoints. Wallarm also provides the customers with the ability to control which specific customer applications, domains or URLs should have the **Attack rechecker** scanner enabled or disabled for. 

For now, the configuration can be managed only via Wallarm technical support team - please feel free to reach out using email [support@wallarm.com](mailto:support@wallarm.com).

#### Optional: Configure Attack rechecker request rewriting rules (run tests against a copy of the application)

If you want to run checks against the copy of the application and completely avoid scanning the production application, then it is possible to create a [rule](../user-guides/rules/change-request-for-active-verification.md) which instructs the **Attack rechecker** to modify certain elements in replayed attack requests.

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
