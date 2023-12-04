# API Leaks Remediation

The **API Leaks** module of the Wallarm platform actively scans thousands of public repositories and sources to check for the leaks of API tokens. This article gives an overview of API Leaks: issues addressed by it, its purpose and main possibilities.

The module can operate in two different modes: 

* **Only detect** API leaks and report that to users via the **API Leaks** section in Wallarm Cloud. Additionally, you may configure Wallarm to send notifications about found API leaks via email or messengers.
* Detect and [**perform measures to block**](#making-decisions) usage of leaked credentials until they are regenerated or removed. This requires deployed Wallarm [node(s)](../user-guides/nodes/nodes.md).

![API Leaks](../images/about-wallarm-waf/api-leaks/api-leaks.png)

## Issues addressed by API Leaks

Your organization may use a number of API tokens to provide access to the different parts of your API. If these tokens leak, they become a security threat.

In order to protect your APIs, you need to monitor public repositories to find any leaked API tokens, without missing a single instance – otherwise, you’re still at risk. To achieve this, you have to constantly analyze a huge amount of data over and over again.

If leaked API secrets are found, a multifaceted response is needed to prevent harm to your APIs. This involves finding all the places where the leaked secrets are used, regenerating them in all these places, and blocking use of the compromised versions – and this has to be done quickly, and with 100% completeness. This is difficult to accomplish manually.

The **API Leaks** Wallarm module helps to solve these issues by providing the following:

* Automatic detection of leaked API tokens from public resources and logging of detected leaks in the Wallarm Console UI.
* Risk level detection.
* Ability to add leaks manually.
* Ability to make your own decisions on how the leaked data problems should be remediated in each case.

## Visualization of found leaks

The **API Leaks** section provides rich visual representation for your current situation regarding found API leaks. This representation is interactive: you can click diagram elements to filter leaks by risk levels and sources.

![API Leaks - Visualization](../images/about-wallarm-waf/api-leaks/api-leaks-visual.png)

## Access API Leaks

By default, the API Leaks module is disabled. To get access to the module, please send a request to [Wallarm technical support](mailto:support@wallarm.com).

## New API leaks

There are two ways to register new leaks:

* Automatic - Wallarm actively scans thousands of public repositories and sources and adds new leaks to the list. Sort by **Status** and view `Opened` leaks - they require your attention.
* Manual - add API leaks manually. Each one is a set of leaked tokens.

![API Leaks - Manual adding](../images/about-wallarm-waf/api-leaks/api-leaks-add-manually.png)

## Interactive visualization

The **API Leaks** section provides rich visual representation for your current situation regarding found API leaks. Use the graphics to quickly analyze current situation with found leaks, click diagram elements to filter leaks by risk levels and sources.

![API Leaks - Visualization](../images/about-wallarm-waf/api-leaks/api-leaks-visual.png)

## Making decisions

Regardless of how the API leak was added - automatically or manually - the decision on what to do is always yours. You can manage these decisions as follows:

* Apply virtual patch to block all attempts of using leaked tokens.

    A [virtual patch rule](../user-guides/rules/vpatch-rule.md) will be created.

* Mark leak as false if you think it was added by mistake.
* Close leaks to stop protection once all leaked tokens were regenerated or removed. This will remove the virtual patch rule.
* Even if a leak is closed, it is not deleted. Reopen and then apply remediation to start protection again.

## Attempts to use leaked tokens

In Wallarm Console → **Attacks**, set the **Type** filter to `Virtual patch` (`vpatch`) to see all attempts of leaked tokens usage.

![Events - API leaks via vpatch](../images/about-wallarm-waf/api-leaks/api-leaks-in-events.png)

For now, you can track the attempts of leaked tokens usage only if `vpatch` is applied.
