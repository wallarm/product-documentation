# Detecting Security Issues <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Once [API Surface Discovery](api-surface.md) finds the external hosts of your domains, Wallarm checks if these hosts have any security issues. Once found, the issues are listed and described in the **Security Issues** section. This article describes how to use the presented information.

## Exploring security issues

To explore the security issues found for your external hosts, in Wallarm Console go to the AASM's **Security Issues** section.

![Security Issues](../images/api-attack-surface/security-issues.png)

Here, the detailed information on found issues is presented, including:

* Brief and detailed issue description
* Risk level evaluation and distribution of security issues by these levels
* Top vulnerable hosts list

## Define your domains to search for security issues

You can define a list of your root domains where you want to search for security issues:

1. In the **API Attack Surface** or **Security Issues** section, click **Configure**.
1. At the **Scope** tab, add your domains.

    Wallarm will start searching for subdomains and leaked credentials published under the domain. The search progress and results will be displayed at the **Status** tab.

![Security issues - configuring scope](../images/api-attack-surface/security-issues-configure-scope.png)

## API leaks

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

## Viewing requests blocked by virtual patches

You can view requests blocked by [virtual patches](../user-guides/rules/vpatch-rule.md) in Wallarm Console → **Attacks** by setting the **Type** filter to `Virtual patch` (`vpatch`).

![Events - Security issues (API leaks) via vpatch](../images/api-attack-surface/api-leaks-in-events.png)

Note that this filter will list not only the virtual patch events caused by the **Security Issues** functionality but also all the other virtual patches, created for different purposes.
