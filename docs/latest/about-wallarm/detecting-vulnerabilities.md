# API Security Testing

**Wallarm API Security Testing** proactively uncovers security issues (vulnerabilities) in your applications and APIs before attackers can exploit them. From this article, you will learn what a security issue is and how the Wallarm platform detects security issues, so you can enhance the security of your applications and APIs.

## What is security issue?

A security issue (vulnerability) is an error made due to negligence or inadequate information when building or implementing an application. A vulnerability can be exploited by an attacker to cross privilege boundaries (i.e. perform unauthorized actions) within an application.

## What security issues are detected?

Wallarm detects security issues of different types including the ones related to server and client-side attacks, authentication and access, business logic, data leaks and others. See the [full list of types](../attacks-vulns-list.md#vulnerability-types).

## Detection methods

To detect vulnerabilities in the applications and APIs, Wallarm uses the following methods:

* [**Passive detection**](#passive-detection): works only for the scope with the `monitoring` [filtration mode](../admin-en/configure-wallarm-mode.md); identifies vulnerabilities and [incidents](../user-guides/events/check-incident.md) by analyzing real traffic, including both requests and responses. This can happen during a security incident, where a real flaw is exploited, or when requests show signs of vulnerabilities, like compromised JWTs, without direct flaw exploitation. Requires an installed [**Wallarm node**](../about-wallarm/api-security-overview.md#how-wallarm-api-security-works).

    !!! tip ""
        Available in both **Cloud Native WAAP** and **Advanced API Security** [subscriptions](../about-wallarm/subscription-plans.md), also in **Security Edge Free Tier**.

* [**API Attack Surface Management (AASM)**](#api-attack-surface-management-aasm): discovers external hosts with their APIs, for each of them identifies missing WAF/WAAP solutions and vulnerabilities. **Does not require** an installed [Wallarm node](../about-wallarm/api-security-overview.md#how-wallarm-api-security-works).

    !!! tip ""
        Available in the **Advanced API Security** [subscription](../about-wallarm/subscription-plans.md), can be added to **Cloud Native WAAP** by request, can be used alone in the separate **API Attack Surface** subscription.

See details on each method in the corresponding sections below along with the information of why and how to [combine](#combining-methods) these methods.

### Passive detection

!!! info "Filtration mode"
    Passive detection works only for the scope with the `monitoring` [filtration mode](../admin-en/configure-wallarm-mode.md).

Passive detection refers to identifying vulnerabilities by analyzing actual traffic, including both requests and responses. Vulnerabilities may be uncovered during a [security incident](../user-guides/events/check-incident.md), where a malicious request successfully exploits a flaw, resulting in the detection of both an incident and a vulnerability. Or when requests show signs of vulnerabilities, like compromised JWTs, without direct flaw exploitation.

For example, if a request carries a [path traversal](../attacks-vulns-list.md#path-traversal) payload such as `GET /?file=../../../../etc/passwd` and the response returns the actual contents of `/etc/passwd`, Wallarm concludes that the endpoint is vulnerable and records both an incident (the flaw was successfully exploited) and a path traversal vulnerability.

Passive vulnerability detection is enabled by default.

### API Attack Surface Management (AASM) <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" class="non-zoomable" style="border: none;"></a>

Wallarm's [API Attack Surface Management](../api-attack-surface/overview.md) (AASM) is an agentless (does not require [Wallarm node](../about-wallarm/api-security-overview.md#how-wallarm-api-security-works) installation) detection solution tailored to the API ecosystem, designed to discover external hosts with their APIs, identify missing WAF/WAAP solutions, and mitigate API Leaks and other vulnerabilities. AASM:

* Discovers external hosts and their APIs (including hosting e.g. CDN, IaaS, or PaaS providers).
* Discovers if APIs are protected by WAFs/WAAPs and from which type of threats they protect.
* Discovers vulnerabilities (security issues) related to the found APIs.
* Allows further management of discovered vulnerability mitigation.

### Combining methods

Wallarm provides two [detection methods](#detection-methods) that complement each other, so in most cases it makes sense to use them together:

* **Passive detection** works wherever a [Wallarm node](../about-wallarm/api-security-overview.md#how-wallarm-api-security-works) is deployed. It finds vulnerabilities by analyzing the traffic that actually passes through the node (including on internal resources), but only once a vulnerability shows up in that traffic — for example, when an attacker exploits it.
* **AASM** is agentless and needs no node. It actively scans your internet-facing perimeter, so it also finds forgotten external hosts and APIs that no node protects, and probes them itself instead of waiting for traffic — but it reaches only resources accessible from the internet.

Because the methods cover different surfaces, they overlap only partially: some [vulnerability types](../attacks-vulns-list.md#vulnerability-types) are detected by just one of them.

## False positives

False positives in vulnerability scanning may occur due to unique attributes or behaviors of each protected application. For example, similar responses to similar requests might signal an active vulnerability in one application, while for another, this may be completely expected and safe behavior.

**When useful**

Marking issues as false positives is useful because it allows you to:

* Tailor security findings to your specific environment.
* Reduce alert noise and avoid distractions from irrelevant findings.
* Focus on vulnerabilities that truly require attention.
* Prevent unnecessary effort spent on known safe cases.
* Ensure security teams can efficiently prioritize and address real threats.

**Two ways of creating**

You can mark security issues as false positives in two ways:

* **Manually**: In the issue details in Wallarm Console, add an appropriate mark to the vulnerability. A vulnerability marked as a false positive will be closed and will not be rechecked.
* **Automatically**: Create [**false positive rules**](../user-guides/vulnerabilities.md#false-positive-rules) in **Security Issues** → **Configure** → **False positive rules** to automatically mark matching issues as false positives or prevent them from being created based on user-defined conditions.

**Common scenarios for automatic rules**

* Automatically mark as false all future vulnerabilities for a specific parameter or endpoint
* Do not create vulnerabilities for a specific host (e.g. honeypot, demo host)
* Do not show vulnerabilities of a specific type at all


## Managing discovered security issues

All detected vulnerabilities are displayed in the Wallarm Console → **Security Issues** section. You can manage vulnerabilities through the interface as follows:

* View and analyze vulnerabilities
* Close vulnerabilities or mark them as false positives

![Security Issues](../images/api-attack-surface/security-issues.png)

If you use the [**API Discovery** module](../api-discovery/overview.md) of the Wallarm platform, vulnerabilities are linked with discovered API endpoints, e.g.:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

For more information on managing vulnerabilities, see the instructions on [working with vulnerabilities](../user-guides/vulnerabilities.md).
