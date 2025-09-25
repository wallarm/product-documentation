[link-aasm-security-issue-risk-level]:  #issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# AASM's Security Issues <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Once [API Attack Surface Discovery](api-surface.md) finds the external hosts of your [selected domains](setup.md), Wallarm checks if these hosts have any security issues. Once found, the issues are listed and described in the **Security Issues** section. This article describes how to use the presented information.

## Detected issues

Wallarm's API Attack Surface Management (AASM) finds more than 40 different types of security issues, some of them are only found by AASM and not by other vulnerability detection methods. Get familiar with all issues found by AASM [here](../attacks-vulns-list.md#vulnerability-types) by searching for "AASM".

Pay specific attention to the issues for which AASM is the only detection method.

## Comparison with other detection methods

To detect vulnerabilities in the applications, Wallarm uses the different methods, within which the AASM has its unique place and purpose.

Briefly, if the goal is to regularly inventory external resources (hosts, APIs, WAAP) and search them for common misconfigurations, vulnerabilities, and CVEs to ensure that software is updated and free of known vulnerabilities, then AASM (scope - external resources) is the answer.

AASM will allow you to find a vulnerability on an external resource that has been forgotten and on which there is no node.

AASM **does not need Wallarm node** to function, and it works **actively**: while with node and its passive detection the vulnerability must be actually exploited to be detected and registered, which may take a long time, AASM sends requests itself and finds vulnerabilities much faster.

See full comparison of methods [here](../about-wallarm/detecting-vulnerabilities.md#combining-methods).

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

Along with all the other security issues (found by any [method](../about-wallarm/detecting-vulnerabilities.md#detection-methods)), the ones found by AASM are displayed in the Wallarm Console → **Events** → **Security Issues** section.

![Security Issues](../images/api-attack-surface/security-issues.png)

You can recognize issues found by AASM by the `AASM` in the **Discovered by** field. You can filter issues to see only the ones found by AASM with the **Discovered by** filter.

Detailed information on how to work with security issue: understand issue statuses, lifecycle and transitions, risk levels, getting details on each issue and mitigation measures, getting notifications and reports - is provided [here](../user-guides/vulnerabilities.md).
