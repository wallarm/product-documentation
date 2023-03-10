# API Leaks

The **API Leaks** module of the Wallarm platform actively scans thousands of public repositories and sources to check for the leaks of API tokens and allow you to block leaked credentials usage using the deployed Wallarm [node(s)](../admin-en/supported-platforms.md). This article gives an overview of API Leaks: issues addressed by it, its purpose and main possibilities.

For information on how to use the **API Leaks** module, refer to its [user guide](../user-guides/api-leaks.md).

![!API Leaks](../images/about-wallarm-waf/api-leaks/api-leaks.png)

## Issues addressed by API Leaks

Your organization may use a number of API tokens to provide access to the different parts of your API. These tokens may leak: be in one or another way accessed and then published to different public repositories and thus become a security threat.

You need to monitor public repositories to find your leaked API tokens and try to miss as few episodes as possible. To achieve this, you have to study manually a huge amount of data over and over again.

If leaked API tokens are found, it is necessary to prevent their usage. To achieve this, you need to find all the places where the leaked tokens are used in your API, regenerate them in all these places, do that quickly, and not to miss any of usage locations.

The **API Leaks** Wallarm module helps to solve these issues by providing the following:

* Automatic detection of leaked API tokens from public resources and logging of detected leaks in the Wallarm Console UI.
* Risk level detection.
* Ability to add leaks manually.
* Ability to make your own decisions on how the leaked data problems should be remediated in each case.

Remediation via blocking leaked tokens works effectively even if you do not know at some moment all the places where the leaked tokens are used in your API. This gives you time to study all the places and regenerate tokens there. Once this is done, you can mark leak as closed - protection will stop as you do not need it anymore.

## Visualization of found leaks

The **API Leaks** section provides rich visual representation for your current situation regarding found API leaks. This representation is interactive: you can click diagram elements to filter leaks by risk levels and sources.

![!API Leaks - Visualization](../images/about-wallarm-waf/api-leaks/api-leaks-visual.png)

## Access API Leaks

* For mitigation of the leaked API tokens threat, Wallarm [node(s)](../user-guides/nodes/nodes.md) should be deployed.
* By default, the API Leaks module is disabled. To get access to the module, please send a request to [Wallarm technical support](mailto:support@wallarm.com).
