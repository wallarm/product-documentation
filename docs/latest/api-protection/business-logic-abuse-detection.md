# Business Logic Abuse Detection

Wallarm utilizes LLM-based analysis to detect the attempts to abuse a business logic of your applications and block these attempts. This article describes what business logic abuse is, how detection and protection works, and how to configure it.

## Examples of logic abuse

TBD

## Availability

This functionality is available in **Free Tier** subscription. If you utilize other [subscriptions](../about-wallarm/subscription-plans.md), contact [Wallarm Support team](https://support.wallarm.com) to get it.

## How detection works

The business logic abuse is not detected by default and requires configuration. Once configured, Wallarm utilizes LLM-based analysis to detect any anomalies in API Sessions: 

* Suspicious or wrong sequence of requests
* Absence of obligatory steps
* Etc.

If decision is that yes, this is an attempt to abuse business logic, the corresponding requests in **API Sessions** are marked as part of TBD attack and processed due to the selected mitigation mode.

## Configuration

Business logic abuse detection and mitigation is configured with one or several **AI Business logic abuse detection** mitigation controls.

Understand parts of the control from descriptions below.

### Scope and scope filters

TBD

### Detection prompt and context window for analysis

In the **Detection prompt** field you write an instruction for the LLM to detect suspicious behavior in requests to your business logic endpoints, e.g.:

* "Detect if the request tries to trigger a refund without proper authorization"
* "Detect if the user is attempting to escalate privileges or access restricted functionality"

In **Context window for analysis** you set how many requests from the same session - **received before the first in-scope request** - should be included in LLM analysis. You do it by setting both number of requests and time window.

How it works:

* Your prompt is "Detect if the request tries to trigger a refund without proper authorization", and LLM is "Gemini".
* Your context window is 5 minutes and 20 requests.
* `Request A` arrives which Gemini decides may be related to refund.
* Case 1: before `Request A`, within 5 minutes, 32 requests occurred: `Request A` and 20 from this 32 will be analyzed by Gemini.
* Case 2: before `Request A`, within 5 minutes, 5 requests occurred: `Request A` and these 5 will be analyzed, 15 more that could be taken are outside time limitation.

The aim of this setting is to provide enough context for the model to detect patterns and identify hidden abuse attempts. You need to rely on your application logic and usual traffic intensity in specific business flows to set the appropriate context.

Keep in mind that bigger context window:

* Potentially, makes analysis more precise
* Takes resources to **hit limits**, and may be unnecessary redundant

About limits: LLM analysis is not free, Wallarm has limits for number of requests analyzed per specific time. Detailed info on these limits can be obtained from [Wallarm Support team](https://support.wallarm.com).

### LLM provider

Here, you select which LLM provider will perform the analysis. Available providers are:

* Gemini
* ChatGPT

### Mitigation mode

Here you decide what to do when business logic abuse is detected: like in many other mitigation controls, you can set to just monitor or block - source IP or session.

In monitoring mode - the **Custom logic abuse** attack will [show up](#viewing-detected-attacks) in **API Sessions**. In blocking mode the same attack will show up and additionally one of the following will be done depending on you configuration:

* Source IP will be placed in [IP **Denylist**](../user-guides/ip-lists/overview.md) for the specified period of time.
* The session the attack belongs to will be blocked for the specified period of time. [Learn more](../api-sessions/blocking.md#blocking-sessions) about when blocking session is better than blocking source IP.

## Creating and applying mitigation control

To create and apply a new mitigation control:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Click **Add control**.
1. In the **Add control** dialog, select **AI Business logic abuse detection**.

    ![Creating mitigation control](../images/user-guides/mitigation-controls/mc-create.png)

1. [Configure](#configuration) your control.
1. Click **Add**. The created control is displayed in the list. It immediately goes into action and performs in accordance with the selected **Mitigation mode**.

    You can temporarily turn off the control right after creation or at any moment later using the **On/Off** switcher.

## Viewing detected attacks

When business logic abuse is detected, it shows up in [API Sessions](../api-sessions/exploring.md):

* Session having corresponding requests is marked as **AI Business logic abuse detection** subject with specified action (**Monitoring** or **Blocking**).
* Corresponding requests within session are marked as part of the **Custom logic abuse** attack.
* This is LLM-based decision, so you always have **Reason** where LLM explains what kind of abuse has happened precisely by its opinion.

![API Sessions - session with detected business logic abuse](../images/api-protection/api-sessions-business-loпшс-abuse.png)

You can find sessions with corresponding attack types using the **Attack** filter - use the **Custom logic abuse** attack type to display only sessions with these attacks. 

Note that business logic abuse is based entirely on [API sessions](../api-sessions/overview.md). Because of that, the attacks found by these mitigation controls are displayed exclusively in the **API Sessions** section (and not displayed in the [**Attacks**](../user-guides/events/check-attack.md) section).
