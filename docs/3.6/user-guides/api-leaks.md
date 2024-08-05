# Managing API Leaks

The **API Leaks** module actively scans thousands of public repositories and sources to check for leaks of API tokens, and allows you to block any leaked tokens to prevent attacks or other harm to your API portfolio. This article gives an information on how to manage the API leaks.

For a basic summary of capabilities, please refer to the **API Leaks** module [overview](../about-wallarm/api-leaks.md).

## Access API Leaks

In Wallarm console, use **API Leaks** section to work as outlined below.

* To enable the **API Leaks** module, please send a request to the [Wallarm technical support](mailto:support@wallarm.com).
* Only users with the **Administrator** or **Global administrator** [role](../user-guides/settings/users.md#user-roles) can access this section and manage leaks.
* Users with the **Analyst** or **Global analyst** role can access this section, but cannot manage leaks.

## New API leaks

There are two ways to register new leaks:

* Automatic - Wallarm actively scans thousands of public repositories and sources and adds new leaks to the list. Sort by **Status** and view `Opened` leaks - they require your attention.
* Manual - add API leaks manually. Each one is a set of leaked tokens.

![API Leaks - Manual adding](../images/api-attack-surface/api-leaks-add-manually.png)

## Interactive visualization

The **API Leaks** section provides rich visual representation for your current situation regarding found API leaks. Use the graphics to quickly analyze current situation with found leaks, click diagram elements to filter leaks by risk levels and sources.

![API Leaks - Visualization](../images/api-attack-surface/api-leaks-visual.png)

## Making decisions

Regardless of how the API leak was added - automatically or manually - the decision on what to do is always yours. You can manage these decisions as follows:

* Apply virtual patch to block all attempts of using leaked tokens.

    A [virtual patch rule](../user-guides/rules/vpatch-rule.md) will be created.

* Mark leak as false if you think it was added by mistake.
* Close leaks to stop protection once all leaked tokens were regenerated or removed. This will remove the virtual patch rule.
* Even if a leak is closed, it is not deleted. Reopen and then apply remediation to start protection again.

## Attempts to use leaked tokens

In Wallarm Console → **Attacks**, set the **Type** filter to `Virtual patch` (`vpatch`) to see all attempts of leaked tokens usage.

![Events - API leaks via vpatch](../images/api-attack-surface/api-leaks-in-events.png)

For now, you can track the attempts of leaked tokens usage only if `vpatch` is applied.
