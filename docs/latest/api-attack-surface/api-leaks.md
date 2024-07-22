# API Leaks <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a> <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

The **API Leaks** component of the Wallarm's [API Attack Surface Management (AASM)](overview.md) actively scans your selected domains for the leaks of the credential data (API tokens and keys, passwords, client secrets, usernames, emails and others). This article gives an overview of the component: issues addressed by it, its purpose and main possibilities.

While searching for API leaks is the module's main goal, it also allows [applying remediation](#making-decisions) (virtual patches) to selected leaks in case you have deployed Wallarm [node(s)](../user-guides/nodes/nodes.md). This will block usage of the leaked data in all requests.

![API Leaks](../images/api-attack-surface/api-leaks-add.png)

## Issues addressed by API Leaks

Your organization may use a number of API credentials to provide access to the different parts of your API. If these credentials leak, they become a security threat.

In order to protect your APIs, you need to monitor public repositories to find any leaked API credentials without missing a single instance – otherwise, you are still at risk. To achieve this, you have to constantly analyze a massive amount of data repeatedly.

If leaked API secrets are found, an all-round response is needed to prevent harm to your APIs. This involves finding all the places where the leaked secrets are used, regenerating them in all these places, and blocking the use of the compromised versions – and this has to be done quickly, and with 100% completeness. This is difficult to accomplish manually.

The **API Leaks** Wallarm component helps to solve these issues by providing the following:

* Automatic detection of API credentials (API tokens and keys, passwords, client secrets, usernames and emails) leaked by your selected domains and logging of detected leaks in the Wallarm Console UI.
* Prioritization and risk-evaluation of found API leaks.
* Ability to promptly respond to API leakages with actionable technical remediation.

## Define your domains to search for API leaks

You can define a list of your domains (**target domains**) where you want to search for API leaks. Once you specify target domains, Wallarm performs the following two-step procedure: 

1. **Passive scan**: checks public resources for published (leaked) data related to these domains.
1. **Active scan**: automatically searches the listed domains for subdomains. Then - as an unauthenticated user - sends requests to their endpoints and checks responses and the source code of pages for the presence of sensitive data. The following data is searched for: credentials, API keys, client secrets, authorization tokens, email addresses, public and private API schemas (API specifications).

To define target domains to search for API leaks:

1. In the **API Attack Surface** or **API Leaks** section, click **Configure**.
1. At the **Scope** tab, add your domains. You can use the names of domains, found by the [API Discovery](../api-discovery/overview.md) module (if enabled) or by [Wallarm's Scanner](../user-guides/scanner.md).

    Wallarm will start searching for subdomains and leaked credentials published under the domain. The search progress and results will be displayed at the **Status** tab.

![API Leaks - configuring scope](../images/api-attack-surface/api-leaks-configure-scope.png)

## Interactive visualization

The **API Leaks** section provides a rich visual representation of your current situation regarding found API leaks. Use the graphics and filters to quickly analyze current situation with found leaks, click diagram elements to filter leaks by targets or risk levels.

![API Leaks - Visualization](../images/api-attack-surface/api-leaks-visual.png)

## Making decisions

You can manage the decisions on what to do with the found leaks as follows:

* If you have a deployed Wallarm [node(s)](../user-guides/nodes/nodes.md), apply a virtual patch to block all attempts to use the leaked API credentials.

    A [virtual patch rule](../user-guides/rules/vpatch-rule.md) will be created.
    
    Note that creating virtual patch is only possible when the leaked secret value is 6 or more symbols or regular expression is no more than 4096 symbols - `Not applicable` remediation status will be displayed if these conditions are not met. The limitations aim to prevent the legitimate traffic blocking.

* Mark the leak as false if you think it was added by mistake.
* Close the leaks to mark that the problem is solved.
* Even if a leak is closed, it is not deleted. Reopen it to mark that problem is still actual.

## Viewing requests blocked by virtual patches

You can view requests blocked by [virtual patches](../user-guides/rules/vpatch-rule.md) in Wallarm Console → **Attacks** by setting the **Type** filter to `Virtual patch` (`vpatch`).

![Events - API leaks via vpatch](../images/api-attack-surface/api-leaks-in-events.png)

Note that this filter will list not only the virtual patch events caused by the **API Leaks** module but also all the other virtual patches, created for different purposes.
