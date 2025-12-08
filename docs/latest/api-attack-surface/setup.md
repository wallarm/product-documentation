[link-aasm-security-issue-risk-level]:  ../user-guides/vulnerabilities.md#issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# API Attack Surface Management Setup  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

This article describes how to enable and configure [API Attack Surface Management](overview.md) to discover your external hosts with their APIs, identify missing WAF/WAAP solutions, and mitigate API Leaks and other vulnerabilities.

## Prerequisites

If besides Wallarm, you use additional facilities (software or hardware) to automatically filter and block traffic, it is recommended that you [configure an allowlist](../admin-en/scanner-addresses.md) that includes the IP addresses for API Attack Surface Management.

This will allow Wallarm components, including API Attack Surface Management, to seamlessly scan your resources for vulnerabilities.

## Enabling

To use AASM, the Wallarm's [API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface) subscription plan should be active for your company. To activate, do one of the following:

* If you do not have Wallarm account yet, do one of the following:

    * [Sing up](../quickstart/getting-started.md#security-edge-free-tier) to Wallarm and select to activate AASM during account creation.
    * Get pricing information and activate AASM on the Wallarm's official site [here](https://www.wallarm.com/product/aasm).

    Both of this activates the Core (freemium) version, and scanning of the used email's domain starts immediately. After activation, you can [add additional domains](setup.md) to the scope.

    You can continue using the Core version for as long as you need, provided that Enterprise features are not necessary for your use. See differences of different versions [here](https://www.wallarm.com/product/aasm-pricing).

* If you already have Wallarm account, contact [sales@wallarm.com](mailto:sales@wallarm.com).

## Domains and hosts

### Adding to scope

To configure [API Attack Surface Management](overview.md) to detect hosts under your selected domains and search for security issues related to these hosts:

1. In Wallarm Console, proceed to **AASM** → **API Attack Surface** → **Configure** → **Domains and hosts**.
1. Add your domains to the scope and check the scanning status.

    For each newly added domain, Wallarm will immediately start scanning for data selected in [**Scan configuration**](#scan-configuration). If necessary, you can stop scan in progress, this will erase all the results.

1. For the added domains, hosts are detected automatically. If necessary, you can add more hosts manually: click **Add host** and paste hosts separated by comma, semicolon, space or new line.
1. Click the domain to see details on its found and added hosts.

    ![AASM - configuring scope](../images/api-attack-surface/aasm-scope.png)

### Deleting from scope

You can delete domains from the scope. On deletion, all hosts previously detected and manually added for this domain will be removed from the list:

1. At the **Domains and hosts** tab, select domain(s) with checkboxes and click **Delete**.
1. As there can be the security issues found for these domains, you need to decide what to do with them. Options are:

    * Keep related security issues 
    * Close related security issues
    * Mark false related security issues
    * Delete related security issues

## Scan configuration

You can select which data related to your domains will be searched for and displayed by [API Attack Surface Management](overview.md).

### General configuration

For your convenience, Wallarm provides a set of predefined profiles for scan configuration. Try switching between profiles to understand their content.

![AASM - scan configuration](../images/api-attack-surface/aasm-scan-configuration.png)

Brief description of profiles:

| Profile | Description |
| --- | --- |
| **Full** | Most complete scan that searches for all types of network services, fully checks WAAP coverage, searches for API leaks by all possible ways and has all vulnerability detection modules enabled. |
| **Fast** | Quick scan for attack surface and basic issues allowing to exclude external API discovery, excluding public HTML/JS content from API leak search, and limiting vulnerability detection modules. |
| **Vulnerabilities & API leaks** | Scan aimed at detecting security issues only. |
| **Attack surface inventory** | Quickly identifies and maps the attack surface without searching for security issues. |
| **API leaks - passive** | Searches for API leaks only with no interactions to your infrastructure. |
| **Custom** | Enabled every time you make some adjustments to any other profile. |

To configure scanning options:

1. In Wallarm Console, proceed to **AASM** → **API Attack Surface** → **Configure** → **Scan configuration**.
1. Select the appropriate profile.
1. If necessary manually adjust profile options. Note that some options cannot be excluded from specific profiles.

    !!! warning "Do not lose your modification while editing"
        Remember that whatever changes you made in options, they will be lost if you click one of standard profiles again.

### Subdomain discovery

AASM discovers subdomains using a combination of passive and active methods.

Passive detection methods are approaches for discovering subdomains without direct communication with customer's infrastructure. This includes information gathering from:

* TLS Certificate Transparency logs
* Passive DNS databases
* Search engines
* Internet-scan data (e.g., Shodan, Censys, etc.)

Active subdomain detection methods include:

* Analysis of TLS certificates
* Subdomain brute force (guessing most frequently used subdomain names)

After discovering subdomains, AASM validates them for wildcards to ensure the accuracy of detected subdomains.

**Subdomain discovery enabling/disabling**

In some cases that could be optimal to disable subdomain discovery (to scan `example.com` but not to scan `app1.example.com`):

* You are not the owner of the subdomain (it may be owned by a subsidiary company or branch company)
* All subdomains are wildcards (when any subdomain with any random name exists), infinite number of subdomains
* You want to additionally optimize scan performance

When subdomain discovery is enabled in your configuration (**Scan configuration** → **Scanning profile** → **Network service discovery** → **Subdomain discovery**), you can adjust this option per domain. To do so:

1. Go to the **Domains and hosts** tab.
1. Turn off/on the **With subdomains** option for your domains.

    Note that global option has priority - when disabled, subdomains are not searched anywhere. When globally enabled, per-domain options allow making exceptions.

### RPS limit

To avoid overloading servers, you can set how many requests can API Attack Surface Management send per time when scanning your domains. The requests per second (RPS) limits can be set for:

* **All domains combined**: at any moment during the scan, AASM will send no more than 100 requests per second across all resources.
* **Each domain separately**: AASM will not exceed the RPS value for each domain (and its subdomains), for example, if set to 100 RPS:

    * `domain-a.com` (and its subdomains) are scanned at up to 100 RPS
    * `domain-b.com` (and its subdomains) are scanned at up to 100 RPS
    * If `sub.domain-a.com` and `sub.domain-b.com` resolve to the same IP address, that IP could receive up to 200 RPS total

* **Each IP address**: AASM will not exceed the RPS value for each IP address. Helps preventing overloading a host when multiple subdomains resolve to the same IP address, for example, if set to 100 RPS: 

    * If sub.domain-a.com and sub.domain-b.com resoles to the same IP address, this IP will be scanned with a rate not exceeding 100 RPS.

To set AASM's RPS limit:

1. Open Wallarm Console → **API Attack Surface** → **Configure** → **Scan configuration**.
1. Select **RPS limit**. Once selected, apply options are displayed.
1. Select to what to apply the limit. Save the changes.

![AASM - configuring RPS limits](../images/api-attack-surface/aasm-rps-limits.png)

!!! info "Scan duration"
    Enforcing a rate limit increases the overall scan duration.

### Host retention policy

To make sure AASM's data is always up-to-date, you can set AASM to automatically delete retired hosts after specified period of time and number of rescans. By default, this feature is disabled. If you enable it, set additionally what to do with the security issues detected for the hosts being deleted: keep them as is (default) or delete, mark as false or close.

![AASM - host retention policy](../images/api-attack-surface/aasm-host-retention.png)

## Auto rescan

When auto rescan is enabled, previously added domains are automatically re-scanned once every 7 days - new hosts are added automatically, previously listed but not found during re-scan are staying in the list.

To configure auto rescan:

1. In Wallarm Console, proceed to **AASM** → **API Attack Surface** → **Configure** → **Scan configuration** and enable the **Auto rescan** option.
1. At the **Domains and hosts** tab, select domains to be included or excluded from auto rescan.

    Note that global option has priority - when disabled, nothing is auto re-scanned. The per-domain options allow excluding some domains from auto rescan.

![AASM - configuring auto rescan](../images/api-attack-surface/aasm-auto-rescan.png)

## Manual rescan

You can start scanning for any domain manually at **AASM** → **API Attack Surface** → **Configure** → **Domains and hosts** by clicking the **Scan now** button.

If necessary, you can stop scan in progress, this will erase all the results.

## Scanning status

A brief information about when your domains were added to the scope and last scanned is presented at **AASM** → **API Attack Surface** → **Configure** → **Domains and hosts**.

![AASM - configuring scope domains](../images/api-attack-surface/aasm-scope.png)

Navigate back from configuration dialog to the main **API Attack Surface** screen, here you can see the **Host scanning status** summary, then switch to **Scanning status** tab to see a detailed history of all scans including:

* Which domain was scanned (**Target**).
* How scan was started - manually or automatically (**Start-up option**).
* General number of hosts and new hosts found during this scan.
* General number of security issues and new security issues found during this scan.
* Scan status, its start and finish date/time.

![AASM - detailed scanning status](../images/api-attack-surface/aasm-scanning-status.png)

## Notifications

You automatically receive notifications to your personal email (the one you use to log in) about discovered hosts and security issues in a **Weekly AASM statistics** - information about hosts, APIs, and statistics for security issues discovered for your configured domains within last week.

The notifications are enabled by default. You can unsubscribe at any moment and configure any additional emails to get all or some of these notifications in Wallarm Console → **Configuration** → **Integrations** → **Email and messengers** → **Personal email** (you email) or **Email report** (extra emails) as described [here][link-integrations-email].

Additionally, the notifications about security issues detected by [all methods](../about-wallarm/detecting-vulnerabilities.md#detection-methods), including AASM, can be received. This includes:

* Email notifications
* Instant notifications

See details [here](../user-guides/vulnerabilities.md#notifications).
