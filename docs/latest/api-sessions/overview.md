# API Sessions Overview <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Sessions** module of the Wallarm platform monitors and displays the user sessions in your applications' traffic. Within each monitored session, Wallarm collects information about its requests. This article gives an overview of **API Sessions**: issues addressed by it, its purpose and main possibilities.

## Issues addressed by API Sessions

The main issue the **API Sessions** module deals with is that when dealing only with the attacks presented in the **Attacks** or **Incidents** section, you cannot see their full contexts: the logic sequence of requests that the attack is the part of. This context allows revealing of more general patterns in how your applications are being attacked as well as understanding of which business logic will be affected by the taken security measures.

![!API Sessions section - monitored sessions](../images/api-sessions/api-sessions.png)

**As you have the API sessions monitored by Wallarm, you can**:

* [Track user activity](exploring.md#full-context-of-threat-actor-activities) by displaying a list of requests made in a single session, so you can identify unusual patterns of behavior or deviations from typical usage.
* Know which API flow/business logic sequences will be affected before tuning a particular [false positive](../about-wallarm/protecting-against-attacks.md#false-positives), applying the [virtual patch](../user-guides/rules/vpatch-rule.md), adding [rules](../user-guides/rules/rules.md), or enabling [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) controls.
* [Inspect endpoints](exploring.md) requested in user sessions, quickly getting information about their protection and risk level, and presented problems, including being [shadow or zombie](../api-discovery/rogue-api.md).
* [Identify performance issues](exploring.md#identifying-performance-issues) and bottlenecks to optimize the user experience.
* [Verify API abuse detection accuracy](exploring.md#verifying-api-abuse-detection-accuracy) by viewing the entire sequence of requests that was flagged as malicious bot activity.

## How API Sessions module works

The **API Sessions** module:

* Monitors [all traffic](setup.md#analyzed-traffic) to your hosts/applications.
* Using built-in set of key parameters, [groups](setup.md#session-identification) requests into sessions and displays sessions with their requests in the **API Sessions** section. You can [add your own](setup.md#session-identification) parameters for session identification based on your applications' logic.
* Saves the values of the parameters from the requests' data that you need to understand activities within the session. Parameters from the built-in set, if they are presented in the requests are always displayed, you can [add custom parameters](setup.md#context-parameters) in the settings.
* Stores and displays sessions for the last week. The older sessions are deleted to provide an optimal performance and resource consumption.

## Enabling and configuring API Sessions

To start using API Sessions, you need the [Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription plan.

API Sessions has the built-in rules for the session identification and does not require any configuration to start working immediately after you purchase the subscription plan.

Besides built-in configuration, API Sessions provide you with the flexible customization options allowing to:

* Tune the session identification in accordance with your applications' logic.
* Populate session details with any parameters that you need to understand the session activities.

See details in [API Sessions Setup](setup.md).
