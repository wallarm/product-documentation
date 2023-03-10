# Managing API Leaks

The **API Leaks** module of the Wallarm platform actively scans thousands of public repositories and sources to check for the leaks of API tokens and allow you to block leaked credentials usage. This article gives an information on how to manage the API leaks.

For basic understanding, refer to the module's [overview](../about-wallarm/api-leaks.md).

## Access API Leaks

In Wallarm console, use **API Leaks** section to work as described below.

* To get access to the API Leaks module, please send a request to [Wallarm technical support](mailto:support@wallarm.com).
* Only users with the **Administrator** or **Global administrator** [role](../user-guides/settings/users.md#user-roles) can access the section and manage leaks.
* Users with the **Analyst** or **Global analyst** role can access the section, but cannot manage leaks.

## New leaks

There are two ways of registering new leaks:

* Automatic - Wallarm actively scans thousands of public repositories and sources and adds new leaks to the list. Sort by **Status** and view `Opened` leaks - they require your attention.
* Manual - add API leaks manually. Each one is a set of leaked tokens.

![!API Leaks - Manual adding](../images/about-wallarm-waf/api-leaks/api-leaks-add-manually.png)

## Interactive diagrams

The **API Leaks** section provides rich visual representation for your current situation regarding found API leaks. Use diagrams to quickly analyze current situation with found leaks, сlick diagram elements to filter leaks by risk levels and sources.

![!API Leaks - Visualization](../images/about-wallarm-waf/api-leaks/api-leaks-visual.png)

## Making decisions

However the leak was added - automatically or manually - the decision on what to do is always yours. You can manage these decisions as follows:

* Apply virtual patch to block all attempts of using leaked tokens.

    A [virtual patch rule](../user-guides/rules/vpatch-rule.md) will be created.

* Mark leak as false if you think, leak was added by mistake.
* Close leaks to stop protection once all leaked tokens were regenerated or removed. This will remove the virtual patch rule.
* Whatever was closed is not deleted. Reopen and then apply remediation to start protection again.

## Leaked tokens usage attempts

In Wallarm Console → **Events**, set the **Type** filter to `Virtual patch` (`vpatch`) to see all attempts of leaked tokens usage.

![!Events - API leaks via vpatch](../images/about-wallarm-waf/api-leaks/api-leaks-in-events.png)

For now, you can track the attempts of leaked tokens usage only if `vpatch` is applied.
