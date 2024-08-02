# API Leaks Remediation

The **API Leaks** module of the Wallarm platform actively scans thousands of public repositories and sources to check for the leaks of API tokens and allow you to block leaked credentials usage by means of the deployed Wallarm [node(s)](../installation/supported-deployment-options.md). This article gives an overview of API Leaks: issues addressed by it, its purpose and main possibilities.

For information on how to use the **API Leaks** module, refer to its [user guide](../user-guides/api-leaks.md).

![API Leaks](../images/api-attack-surface/api-leaks.png)

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

![API Leaks - Visualization](../images/api-attack-surface/api-leaks-visual.png)

## Access API Leaks

* For mitigation of the leaked API tokens threat, Wallarm [node(s)](../user-guides/nodes/nodes.md) should be deployed.
* By default, the API Leaks module is disabled. To get access to the module, please send a request to [Wallarm technical support](mailto:support@wallarm.com).
