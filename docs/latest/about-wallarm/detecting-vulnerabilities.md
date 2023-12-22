[allowlist-scanner-addresses]: ../user-guides/ip-lists/allowlist.md

# Detecting Vulnerabilities

Due to negligence or inadequate information when building or implementing an application, it can be vulnerable to attacks. From this article, you will learn how the Wallarm platform detects application vulnerabilities enabling you to enhance system security.

## What is a vulnerability?

A vulnerability is an error made due to negligence or inadequate information when building or implementing an application. A vulnerability can be exploited by an attacker to cross privilege boundaries (i.e. perform unauthorized actions) within an application.

## Vulnerability detection methods

When scanning the application for active vulnerabilities, Wallarm sends requests with attack signs to the protected application address and analyzes application responses. If the response matches one or more pre‑defined vulnerability signs, Wallarm records active vulnerability.

For example: if the response to the request sent to read the `/etc/passwd` contents returns the `/etc/passwd` contents, protected application is vulnerable to the Path Traversal attacks. Wallarm will record the vulnerability with an appropriate type.

To detect vulnerabilities in the application, Wallarm sends requests with attack signs using the following methods:

* **Passive detection**: the vulnerability was found due to the security incident that occurred.
* **Active threat verification**: lets you turn attackers into penetration testers and discover possible security issues from their activity as they probe your apps/APIs for vulnerabilities. This module finds possible vulnerabilities by probing application endpoints using real attack data from the traffic. By default this method is disabled.
* **Vulnerability Scanner**: company's exposed assets are scanned for typical vulnerabilities.

### Passive detection

With passive detection, Wallarm detects a vulnerability due to the security incident that occurred. If an application vulnerability has been exploited during an attack, Wallarm records the security incident and the exploited vulnerability.

Passive vulnerability detection is enabled by default.

### Active threat verification <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarm's Active Threat Verification turns attackers into your own penetration testers. It analyzes initial attack attempts, then explores other ways the same attack could be exploited. This exposes weak spots in your environment that even the original attackers did not find. [Read more](../vulnerability-detection/active-threat-verification/overview.md)

The Active Threat Verification capabilities:

* **Real-time testing**: Uses live attack data to spot current and potential future weak spots, keeping you one step ahead of hackers.
* **Safe & smart simulation**: Skips sensitive authentication details and removes harmful code in tests. Simulates attack techniques for max security, not risking actual harm.
* **Safe non-production tests**: Enables you to [run vulnerability checks in a staging or development setup](../vulnerability-detection/active-threat-verification/running-test-on-staging.md) using real production data, but without the risks like system overload or data exposure.

The module is disabled by default. To enable it:

1. Ensure you have an active **Advanced API Security** [subscription plan](subscription-plans.md#subscription-plans). The module is only available under this plan.

    If you are on a different plan, please contact our [sales team](mailto:sales@wallarm.com) to transition to the required one.
1. Proceed to Wallarm Console → **Vulnerabilities** → **Configure** by following the link for the [US Cloud](https://us1.my.wallarm.com/vulnerabilities/active?configure=true) or [EU Cloud](https://my.wallarm.com/vulnerabilities/active?configure=true), and toggle on the **Active threat verification** switch.

You further have the ability to [adjust or customize the module's behavior](../vulnerability-detection/active-threat-verification/enable-disable-active-threat-verification.md) for specific endpoints.

### Vulnerability Scanner <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### How it works

Vulnerability Scanner checks all company's exposed assets for typical vulnerabilities. Scanner sends requests to application addresses from fixed IP addresses and adds the header `X-Wallarm-Scanner-Info` to the requests.

#### Configuration

* Scanner can be [enabled or disabled](../user-guides/vulnerabilities.md#configuring-vulnerability-detection) in Wallarm Console → **Vulnerabilities** → **Configure**. By default, Scanner is enabled.
* The list of [vulnerabilities that can be detected](../user-guides/vulnerabilities.md#configuring-vulnerability-detection) by Scanner can be configured in Wallarm Console → **Vulnerabilities** → **Configure**. By default, Vulnerability Scanner detects all available vulnerabilities.
* The [limit of requests sent from Scanner](../user-guides/scanner.md#limiting-vulnerability-scanning) can be configured for each asset in Wallarm Console → **Scanner** → **Configure**.
* If you use additional facilities (software or hardware) to automatically filter and block traffic, it is recommended that you configure an allowlist with the [IP addresses](../admin-en/scanner-addresses.md) for the Wallarm Scanner. This will allow Wallarm components to seamlessly scan your resources for vulnerabilities.

    You do not need to manually allowlist Scanner IP addresses in Wallarm - starting with Wallarm node 3.0, Scanner IP addresses are allowlisted automatically.

## Weak JWTs detection

JSON Web Tokens (JWT) are a widely used method for representing claims securely between two parties. However, if JWTs are not implemented and used properly, they introduce security vulnerability. Starting from Wallarm node version 4.4, Wallarm supports [Weak JWTs](../attacks-vulns-list.md#weak-jwt) vulnerability detection.

Weak JWTs detection is enabled by default - the new company accounts are featured by the pre-configured (default) **Weak JWT** trigger which, if a significant amount of incoming requests processed by the Wallarm node contains weak JWTs, records the corresponding vulnerability.

To disable weak JWTs detection, you can disable or delete this trigger in Wallarm Console → **Triggers** section. To resume detection, re-enable or re-create the trigger. Note that only one **Weak JWT** trigger can exist.

## False positives

**False positive** occurs when attack signs are detected in the legitimate request or when legitimate entity is qualified as a vulnerability. [More details on false positives in attack detection →](protecting-against-attacks.md#false-positives)

False positives in vulnerability scanning may occur due to the protected application specificities. Similar responses to similar requests may indicate an active vulnerability in one protected application and be expected behavior of another protected application.

If a false positive for a vulnerability is detected, you can add an appropriate mark to the vulnerability in Wallarm Console. A vulnerability marked as a false positive will be closed and will not be rechecked.

If the detected vulnerability exists in the protected application but cannot be fixed, we recommend setting up the [**Create a virtual patch**](../user-guides/rules/vpatch-rule.md) rule. This rule will allow blocking attacks exploiting the detected type of vulnerability and will eliminate the risk of an incident.

## Managing discovered vulnerabilities

All detected vulnerabilities are displayed in the Wallarm Console → **Vulnerabilities** section. You can manage vulnerabilities through the interface as follows:

* View and analyze vulnerabilities
* Run vulnerability status verification: still active or fixed on the application side
* Close vulnerabilities or mark them as false positives

![Vulnerabilities section](../images/user-guides/vulnerabilities/check-vuln.png)

If you use the [**API Discovery** module](../api-discovery/overview.md) of the Wallarm platform, vulnerabilities are linked with discovered API endpoints, e.g.:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

For more information on managing vulnerabilities, see the instructions on [working with vulnerabilities](../user-guides/vulnerabilities.md).

## Notifications about discovered vulnerabilities

Wallarm can send you notifications on discovered vulnerabilities. It allows you to be aware of newly discovered vulnerabilities of your applications and respond to them promptly. Responding to vulnerabilities includes fixing them on the application side, reporting false positives and applying virtual patches.

To configure notifications:

1. Create the [native integration](../user-guides/settings/integrations/integrations-intro.md) with the system to send notifications (e.g. PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. In the integration card, select the **Vulnerabilities detected** in the list of available events.

Example of the Splunk notification about detected vulnerability:

```json
{
    summary:"[Test message] [Test partner(US)] New vulnerability detected",
    description:"Notification type: vuln

                New vulnerability was detected in your system.

                ID: 
                Title: Test
                Domain: example.com
                Path: 
                Method: 
                Discovered by: 
                Parameter: 
                Type: Info
                Threat: Medium

                More details: https://us1.my.wallarm.com/object/555


                Client: TestCompany
                Cloud: US
                ",
    details:{
        client_name:"TestCompany",
        cloud:"US",
        notification_type:"vuln",
        vuln_link:"https://us1.my.wallarm.com/object/555",
        vuln:{
            domain:"example.com",
            id:null,
            method:null,
            parameter:null,
            path:null,
            title:"Test",
            discovered_by:null,
            threat:"Medium",
            type:"Info"
        }
    }
}
```
