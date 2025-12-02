# Detecting Security Issues

Due to negligence or inadequate information when building or implementing an application, it can be vulnerable to attacks. From this article, you will learn how the Wallarm platform detects application vulnerabilities enabling you to enhance system security.

## What is security issue?

A security issue (vulnerability) is an error made due to negligence or inadequate information when building or implementing an application. A vulnerability can be exploited by an attacker to cross privilege boundaries (i.e. perform unauthorized actions) within an application.

## What security issues are detected?

Wallarm detects security issues of different types including the ones related to server and client-side attacks, authentication and access, business logic, data leaks and others. See the [full list of types](../attacks-vulns-list.md#vulnerability-types).

## Detection methods

<!--When scanning the application for active vulnerabilities, Wallarm sends requests with attack signs to the protected application address and analyzes application responses. If the response matches one or more pre‑defined vulnerability signs, Wallarm records active vulnerability.

For example: if the response to the request sent to read the `/etc/passwd` contents returns the `/etc/passwd` contents, protected application is vulnerable to the Path Traversal attacks. Wallarm will record the vulnerability with an appropriate type.-->

To detect vulnerabilities in the applications and APIs, Wallarm uses the following methods:

* [**Passive detection**](#passive-detection): identifies vulnerabilities by analyzing real traffic, including both requests and responses. This can happen during a security incident, where a real flaw is exploited, or when requests show signs of vulnerabilities, like compromised JWTs, without direct flaw exploitation.

    !!! tip ""
        Available in both **Cloud Native WAAP** and **Advanced API Security** [subscriptions](../about-wallarm/subscription-plans.md), also in **Security Edge Free Tier**. Requires installed [**Wallarm node**](../about-wallarm/overview.md#how-wallarm-works).

* [**Threat Replay Testing (TRT)**](#threat-replay-testing-trt), part of [Wallarm's Security Testing suite](../vulnerability-detection/security-testing-overview.md): lets you turn attackers into penetration testers and discover possible security issues from their activity as they probe your apps/APIs for vulnerabilities. This module finds possible vulnerabilities by probing application endpoints using real attack data from the traffic.

    !!! tip ""
        Available in the **Security Testing** [subscription](../about-wallarm/subscription-plans.md). Requires installed [**Wallarm node**](../about-wallarm/overview.md#how-wallarm-works).

* [**Schema-Based Testing (SBT)**](#schema-based-testing-sbt), part of [Wallarm's Security Testing suite](../vulnerability-detection/security-testing-overview.md): dynamic application security testing (DAST) solution that enables "shift-left" security - proactively identifies a wide range of vulnerabilities early in the development process; uses an API's schema (such as an OpenAPI specification or a Postman collection) as a blueprint to automatically generate and execute targeted security tests.

    !!! tip ""
        Available in the **Security Testing** [subscription](../about-wallarm/subscription-plans.md). **Does not require** installed [Wallarm node](../about-wallarm/overview.md#how-wallarm-works).

* [**API Attack Surface Management (AASM)**](#api-attack-surface-management-aasm): discovers external hosts with their APIs, for each of them identifies missing WAF/WAAP solutions and vulnerabilities.

    !!! tip ""
        Available in the **Advanced API Security** [subscription](../about-wallarm/subscription-plans.md), can be added to **Cloud Native WAAP** by request, can be used alone in the separate **API Attack Surface** subscription. **Does not require** installed [Wallarm node](../about-wallarm/overview.md#how-wallarm-works).

See details on each method in the corresponding sections below along with the information of why and how to [combine](#combining-methods) these methods.

### Passive detection

Passive detection refers to identifying vulnerabilities by analyzing actual traffic, including both requests and responses. Vulnerabilities may be uncovered during a security incident, where a malicious request successfully exploits a flaw, resulting in the detection of both an incident and a vulnerability. Or when requests show signs of vulnerabilities, like compromised JWTs, without direct flaw exploitation.

Passive vulnerability detection is enabled by default.

### Threat Replay Testing (TRT) <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a> <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/security-testing-tag.svg" style="border: none;"></a>

Wallarm's [Threat Replay Testing](../vulnerability-detection/threat-replay-testing/overview.md) turns attackers into your own penetration testers. It analyzes initial attack attempts, then explores other ways the same attack could be exploited. This exposes weak spots in your environment that even the original attackers did not find.

The Threat Replay Testing capabilities:

* **Real-time testing**: Uses live attack data to spot current and potential future weak spots, keeping you one step ahead of hackers.
* **Safe & smart simulation**: Skips sensitive authentication details and removes harmful code in tests. Simulates attack techniques for max security, not risking actual harm.
* **Safe non-production tests**: Enables you to [run vulnerability checks in a staging or development setup](../vulnerability-detection/threat-replay-testing/setup.md) using real production data, but without the risks like system overload or data exposure.

### Schema-Based Testing (SBT) <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/security-testing-tag.svg" style="border: none;"></a>

Wallarm's [Schema-Based Testing](../vulnerability-detection/schema-based-testing/overview.md) is a dynamic application security testing (DAST) solution that enables "shift-left" security. It uses an API's schema (such as an OpenAPI specification or a Postman collection) as a blueprint to automatically generate and execute targeted security tests. By integrating into CI/CD pipelines, Schema-Based Testing allows development teams to proactively identify a wide range of vulnerabilities—including OWASP API Top 10 risks, business logic flaws, and input validation issues—early in the development process, making them easier and cheaper to fix.

Schema-Based Testing capabilities:

* Tests based on provided application's OpenAPI specification or Postman collection.
* Deep, dynamic analysis of API endpoints.
* Detection of vulnerabilities in the application or API itself, as well as security misconfigurations in the underlying infrastructure or environment.
* Lightweight execution via Docker container.

### API Attack Surface Management (AASM) <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarm's [API Attack Surface Management](../api-attack-surface/overview.md) (AASM) is an agentless (do not require [Wallarm node](../about-wallarm/overview.md#how-wallarm-works) installation) detection solution tailored to the API ecosystem, designed to discover external hosts with their APIs, identify missing WAF/WAAP solutions, and mitigate API Leaks and other vulnerabilities. AASM:

* Discovers external hosts and their APIs (including hosting e.g. CDN, IaaS, or PaaS providers).
* Discovers if APIs are protected by WAFs/WAAPs and from which type of threats they protect.
* Discovers vulnerabilities (security issues) related to the found APIs.
* Allows further management of discovered vulnerability mitigation.

**Replacement of old Scanner**

From May 7, 2025, AASM [replaced the old Scanner](../api-attack-surface/api-surface.md#replacement-of-old-scanner) as a more sophisticated and comfortable tool for host and API discovery.

### Combining methods

As Wallarm provides many different [methods](#detection-methods) of detecting vulnerabilities, the questions arise about which of them to choose and how to combine them. Consider the information below to answer this.

Passive detection and TRT require the [Wallarm node](../about-wallarm/overview.md#how-wallarm-works). SBT and AASM - does not. Some [vulnerabilities](../attacks-vulns-list.md#vulnerability-types) are found only by some (not by all) of the listed methods.

Also, it is important to understand why we may need AASM if we already have passive detection for vulnerabilities and API Discovery (APID) for discovering hosts.

Questions:
* [If I already have a node and automatically have passive detection, why do I need to set up TRT additionally?](#q_1)
* [If I want to do without a node, what should I choose - AASM or SBT?](#q_2)
* [Why do I need no-node solutions if I already have a node with passive detection (and possibly TRT)?](#q_3)
* [Why do I need AASM if I already have a node with passive detection and APID, which has already found all my hosts?](#q_4)
* [Why do I need APID if AASM has already found all my hosts and their problems?](#q_5)

<a name="q_1"></a>**If I already have a node and automatically have passive detection, why do I need to set up TRT additionally?**

Passive detection is a great bonus of filtering node: nothing needs to be configured, requests themselves pass through the node and Wallarm analyzes them for attacks and try to extract additional benefit (identify vulnerabilities).

It also plays an important role in detecting [incidents](../user-guides/events/check-incident.md): if Wallarm finds an attack and this attack is successful (determined by the response), then this means that there is a vulnerability in the application, plus the attacker successfully exploited it means this is an incident.

But here comes a limitation - vulnerability will only be detected if the:

* traffic to the target application is analyzed by the node
* request was not blocked by a node (monitoring mode)
* vulnerability was successfully exploited by an attacker (e.g. attacker exploited path traversal vulnerability and successfully read a system file)

TRT takes attacks from the Cloud, strips them of their malicious payload, and attempts to exploit them on a test server. If successful, a vulnerability is created. Differences from passive detection:

* Passive detection doesn't send anything itself; it only analyzes existing requests.
TRT sends requests itself (active checking).
* For a single attack, passive detection checks only one request/response pair. TRT will create multiple request modifications for a single attack to increase the chance of successful exploitation. Even if the original request was unsuccessful, TRT can modify it to successfully exploit the vulnerability (for example, the attacker failed, didn't tweak it properly, but Wallarm could).
* TRT works even if the original request was blocked.
* Passive detection allows you to detect vulnerabilities even on your internal network (on servers that are not accessible from the internet). TRT scans from the cloud and can only check on servers accessible from the internet.

<a name="q_2"></a>**If I want to do without a node, what should I choose - AASM or SBT?**

If the goal is to regularly inventory external resources (hosts, APIs, WAAP) and search them for common misconfigurations, vulnerabilities, and CVEs to ensure that software is updated and free of known vulnerabilities, then AASM (scope - external resources) is the answer.

SBT is the answer if the goal is to thoroughly analyze an API (custom, in-house developed) and find vulnerabilities. Wallarm is prepared to scan it for quite a while and you are ready to provide all the necessary input to increase the likelihood of detection (credentials, OAS specifications, or a Postman collection).

<a name="q_3"></a>**Why do I need no-node solutions if I already have a node with passive detection (and possibly TRT)?**

* AASM will allow you to find a vulnerability on an external resource that has been forgotten and on which there is no node.
* SBT will scan one application API but in great detail and which, for example, is only available on the internal network.

<a name="q_4"></a>**Why do I need AASM if I already have a node with passive detection and APID, which has already found all my hosts?**

Not all hosts on the perimeter are protected by a node. Even if all are protected, the node may be blocking attacks, and passive detection won't find any vulnerabilities ("protected by node"). For passive detection to find anything, someone needs to exploit the vulnerability. We can wait a very long time, while AASM sends requests itself.

<a name="q_5"></a>**Why do I need APID if AASM has already found all my hosts and their problems?**

AASM only finds hosts on the perimeter, while APID is everywhere a node is located. AASM finds very few APIs, about 1-3%, and there's almost no information on them because it's collecting everything blindly. APID sees all traffic and can almost completely recreate endpoints, methods, and parameters.

## False positives

**False positive** occurs when attack signs are detected in the legitimate request or when legitimate entity is qualified as a vulnerability. [More details on false positives in attack detection →](protecting-against-attacks.md#false-positives)

False positives in vulnerability scanning may occur due to the protected application specificities. Similar responses to similar requests may indicate an active vulnerability in one protected application and be expected behavior of another protected application.

If a false positive for a vulnerability is detected, you can add an appropriate mark to the vulnerability in Wallarm Console. A vulnerability marked as a false positive will be closed and will not be rechecked.

If the detected vulnerability exists in the protected application but cannot be fixed, we recommend setting up the [**Create a virtual patch**](../user-guides/rules/vpatch-rule.md) rule. This rule will allow blocking attacks exploiting the detected type of vulnerability and will eliminate the risk of an incident.

## Managing discovered security issues

All detected vulnerabilities are displayed in the Wallarm Console → **Security Issues** section. You can manage vulnerabilities through the interface as follows:

* View and analyze vulnerabilities
* Close vulnerabilities or mark them as false positives

![Security Issues](../images/api-attack-surface/security-issues.png)

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
