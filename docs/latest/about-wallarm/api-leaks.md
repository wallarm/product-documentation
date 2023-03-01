# API Leaks

The **API Leaks** module of the Wallarm platform actively scans thousands of public repositories and sources to check for the leaks of API tokens and allow you to block leaked credentials usage.

![!API Leaks](../images/about-wallarm-waf/api-leaks/api-leaks.png)

This article gives an overview of API Leaks: issues addressed by it, its purpose and main possibilities. For information on how to use API Leaks, refer to its [user guide](../user-guides/api-leaks.md).

## Issues addressed by API Leaks

Your organization may use a number of API tokens to provide access to the different parts of your API. These tokens may leak: be in one or another way accessed and then published to different public repositories and thus become a security threat.

You need:

* Monitor public repositories to find your leaked API tokens and try to miss as few episodes as possible. To achieve this, you need:

    * Manually study a huge amount of data over and over again.

* If leaked API tokens are found, prevent their usage. To achieve this, you need:

    * Find all the places where the leaked tokens are used in your API.
    * Regenerate them in all these places.
    * Do that quickly.
    * Not to miss any of usage locations.

## What can be done with API Leaks

The **API Leaks** module allows:

* Automatic monitoring of the number of public repositories.
* Automatic detection of leaked API tokens, published on these repositories.
* Automatic risk level detection.
* Automatic adding of detected leaks into the list in the **API Leaks** section of Wallarm.
* Automatic detection of remediation variants.
* Filtering new leaks.
* Analyzing leak information like volume, source and risk level.
* Making your own decisions on whether to block or not the usage of the leaked tokens.

Blocking leaked tokens works effectively even if you do not know at some moment all the places where the leaked tokens are used in your API. This gives you time to study all the places and regenerate tokens there. Once this is done, you can mark leak as closed - protection will stop as you do not need it anymore.

## Visualization of found leaks

The **API Leaks** section provides rich visual representation for your current situation regarding found API leaks. This representation is interactive: you can click diagram elements to filter leaks by risk levels and sources.

![!API Leaks - Visualization](../images/about-wallarm-waf/api-leaks/api-leaks-visual.png)
