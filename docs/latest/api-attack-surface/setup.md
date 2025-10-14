[link-aasm-security-issue-risk-level]:  ../user-guides/vulnerabilities.md#issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# API Attack Surface Management Setup  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

This article describes how to enable and configure [API Attack Surface Management](overview.md) to discover your external hosts with their APIs, identify missing WAF/WAAP solutions, and mitigate API Leaks and other vulnerabilities.

## Enabling

To use AASM, the Wallarm's [API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface) subscription plan should be active for your company. To activate, do one of the following:

* If you do not have Wallarm account yet, do one of the following:

    * [Create it yourself](../quickstart/getting-started.md#self-signup-and-security-edge-free-tier) and select to activate AASM during account creation.
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

In some cases that could be optimal to disable subdomain discovery (to scan `example.com` but not to scan `app1.example.com`):

* You are not the owner of the subdomain (it may be owned by a subsidiary company or branch company)
* All subdomains are wildcards (when any subdomain with any random name exists), infinite number of subdomains
* You want to additionally optimize scan performance

When subdomain discovery is enabled in your configuration (**Scan configuration** → **Scanning profile** → **Network service discovery** → **Subdomain discovery**), you can adjust this option per domain. To do so:

1. Go to the **Domains and hosts** tab.
1. Turn off/on the **With subdomains** option for your domains.

    Note that global option has priority - when disabled, subdomains are not searched anywhere. When globally enabled, per-domain options allow making exceptions.

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

## Preventing from being blocked

If besides Wallarm, you use additional facilities (software or hardware) to automatically filter and block traffic, it is recommended that you [configure an allowlist](../admin-en/scanner-addresses.md) that includes the IP addresses for API Attack Surface Management.

This will allow Wallarm components, including API Attack Surface Management, to seamlessly scan your resources for vulnerabilities.

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

--8<-- "../include/api-attack-surface/aasm-notifications.md"
