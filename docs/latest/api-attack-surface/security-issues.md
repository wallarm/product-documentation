[link-aasm-security-issue-risk-level]:  #issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# AASM's Security Issues <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Once [API Attack Surface Discovery](api-surface.md) finds the external hosts of your [selected domains](setup.md), Wallarm checks if these hosts have any security issues. Once found, the issues are listed and described in the **Security Issues** section. This article describes how to use the presented information.

## Detected issues

Wallarm's API Attack Surface Management (AASM) finds more than 40 different types of security issues, some of them are only found by AASM and not by other vulnerability detection methods. Get familiar with all issues found by AASM [here](../attacks-vulns-list.md#vulnerability-types) by searching for "AASM".

Pay specific attention to the issues for which AASM is the only detection method.

## API leaks

Among other types of security issues, Wallarm detects cases of public exposure of API credentials (API leaks). The leaked API keys can allow attackers to impersonate authorized users, access confidential financial data, and even manipulate transaction flows.

Wallarm searches for the API leak security issues with the following two-step procedure:

1. **Passive scan**: checks public resources for published (leaked) data related to these domains.
1. **Active scan**: automatically searches the listed domains for subdomains. Then - as an unauthenticated user - sends requests to their endpoints and checks responses and the source code of pages for the presence of sensitive data. The following data is searched for: credentials, API keys, client secrets, authorization tokens, email addresses, public and private API schemas (API specifications).

You can manage the decisions on what to do with the found leaks:

* If you have a deployed Wallarm [node(s)](../user-guides/nodes/nodes.md), apply a virtual patch to block all attempts to use the leaked API credentials.

    A [virtual patch rule](../user-guides/rules/vpatch-rule.md) will be created.
    
    Note that creating virtual patch is only possible when the leaked secret value is 6 or more symbols or regular expression is no more than 4096 symbols - `Not applicable` remediation status will be displayed if these conditions are not met. The limitations aim to prevent the legitimate traffic blocking.

* Mark the leak as false if you think it was added by mistake.
* Close the leaks to mark that the problem is solved.
* Even if a leak is closed, it is not deleted. Reopen it to mark that problem is still actual.

**Viewing requests blocked by virtual patches**

You can view requests blocked by [virtual patches](../user-guides/rules/vpatch-rule.md) in Wallarm Console → **Attacks** by setting the **Type** filter to `Virtual patch` (`vpatch`).

![Events - Security issues (API leaks) via vpatch](../images/api-attack-surface/api-leaks-in-events.png)

Note that this filter will list not only the virtual patch events caused by the **Security Issues** functionality but also all the other virtual patches, created for different purposes.

## Managing found issues

Along with all the other security issues (found by any [method](../about-wallarm/detecting-vulnerabilities.md#detection-methods)), the ones found by AASM are displayed in the Wallarm Console → **Security Issues** section.

![Security Issues](../images/api-attack-surface/security-issues.png)

You can recognize issues found by AASM by the `AASM` in the **Discovered by** field. You can filter issues to see only the ones found by AASM with the **Discovered by** filter.

Detailed information on how to work with security issue: understand issue statuses, lifecycle and transitions, risk levels, getting details on each issue and mitigation measures, getting notifications and reports - is provided [here](../user-guides/vulnerabilities.md).

## Notifications

### Email

Information about security issues found specifically by AASM is sent to your personal email within **Weekly AASM statistics** report - information about hosts, APIs, and statistics for security issues discovered for your configured domains within last week.

Additionally, information about security issues found by [any method](../about-wallarm/detecting-vulnerabilities.md#detection-methods) (including AASM) is sent to your email:

* **Daily critical security issues (new only)** - all critical security issues opened for the day, sent once a day with a detailed description of each issue and instructions on how to mitigate it.
* **Daily security issues (new only)** - statistics for security issues opened for the day, sent once a day with information on how many issues of every risk level were found and general action items for mitigation.

The notifications are enabled by default. You can unsubscribe at any moment and configure any additional emails to get all or some of these notifications in Wallarm Console → **Configuration** → **Integrations** → **Email and messengers** → **Personal email** (you email) or **Email report** (extra emails) as described [here](../user-guides/settings/integrations/email.md).

### Instant notification

You can configure instant notification for the new and re-opened security issues in Wallarm Console → **Configuration** → **Integrations** → YOUR_INTEGRATION as described in [your integration](../user-guides/settings/integrations/integrations-intro.md) documentation.

Note that this configuration affect notifications on issues found by [any method](../about-wallarm/detecting-vulnerabilities.md#detection-methods), not only found by AASM.
