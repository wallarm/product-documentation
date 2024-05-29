# API Sessions <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Sessions** module depicts the interaction of individual actors with the business logic of APIs or applications. API Sessions allow identify various behavioral and business-logic flaws and facilitate investigations of security incidents. This article gives an overview of **API Sessions**: describes how it works, enabled and configured, which limitations it currently has.

<!--## Issues addressed by API Sessions

The main issue the **API Sessions** module deals with is that when dealing only with attacks, presented in the **Events** section, you cannot see their full contexts: the logic sequence of requests that the attack is the part of. This context allows revealing of more general patterns in how your applications are being attacked as well as understanding of which business logic will be affected by the taken security measures.

**As you have the API sessions monitored by Wallarm, you can**:

* [Track user activity](exploring.md) by displaying a list of requests made in a single session, so you can identify unusual patterns of behavior or deviations from typical usage.
* [Inspect shadow APIs](exploring.md#inspecting-sessions-with-requests-to-shadow-apis) requested in user sessions.
* [Identify performance issues](exploring.md#analyzing-session-performance-issues) and bottlenecks to optimize user experience.
* [Verify API abuse detection accuracy](exploring.md#inspecting-sessions-with-api-abuse-attacks) by viewing the entire sequence of requests that was flagged as malicious bot activity.
* Know which API flow/business logic sequences will be affected before tuning a particular [false positive](../about-wallarm/protecting-against-attacks.md#false-positives), applying the [virtual patch](../user-guides/rules/vpatch-rule.md), adding [rules](../user-guides/rules/rules.md), or enabling [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) controls.
-->
## How API Sessions work

API Sessions group all requests (legitimate and attacks) within a session according to predetermined rules. Only certain metadata is saved for requests, which eliminates the transfer and processing of sensitive information in the Wallarm Cloud. The identified sequence of requests allows you to analyze the context around a certain event and understand what the attacker did before the recorded incident and what happened after. API Sessions give the security team a convenient tool for conducting investigations and allow you to easily validate identified malicious behavioral patterns detected [using](user-guides/api-abuse-prevention-explore.md#bot-attacks-in-api-sessions) Abuse Prevention.

Use the **API Sessions** section of the Wallarm Console to analyze session content. When working with data, consider existing [limitations](#limitations).

![!API Sessions section - monitored sessions](../images/api-sessions/api-sessions.png)

## Enabling and configuring

API Sessions operate in beta mode and is enabled and configured through [Wallarm support](mailto:support@wallarm.com). This functionality requires node version 4.10.2 or later.

## Limitations

Currently API Sessions have some limitations. In the **API Sessions** section:

* Only sessions for the last 7 days are stored and displayed. Older sessions are automatically deleted.
* The [credential stuffing](about-wallarm/credential-stuffing.md), [brute force](admin-en/configuration-guides/protecting-against-bruteforce.md), [forced browsing](admin-en/configuration-guides/protecting-against-forcedbrowsing.md), and [BOLA](admin-en/configuration-guides/protecting-against-bola-trigger.md) attack types are not marked. 
* The [denylisted](user-guides/ip-lists/overview.md) events are not presented.
