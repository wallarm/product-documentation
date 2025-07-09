# API Abuse Prevention Setup <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable and configure the [API Abuse Prevention](../api-abuse-prevention/overview.md) module to detect and mitigate malicious bots and to avoid blocking legitimate activities.

## Enabling

The API Abuse Prevention module is available in the **Advanced API Security** [subscription plan](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security). It is disabled by default.

To enable API Abuse Prevention:

1. Check that your Wallarm node is 4.2 or later.
1. In Wallarm Console → **API Abuse Prevention**, create or enable at least one [API Abuse profile](#creating-profiles).

## Creating profiles

API abuse profiles are used to configure how Wallarm's **API Abuse Prevention** detects and mitigates malicious bots. You can create different profiles for different applications. Each application can have only one associated profile.

A profile defines from what type of bots to protect, with what sensitivity each type of bot should be detected and what should be the reaction to this bot's activities.

To create an API abuse profile:

1. In the **API Abuse Prevention** section, switch to the **Profiles** tab.
1. Click **Create profile**.
1. Select [automated threats](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention) to protect from, set the **Reaction**:
    
    * **Disabled** - Wallarm will not protect from this type of bot. 
    * **Register attack** - detected malicious bot activities will be displayed in the [**Attacks**](../user-guides/events/check-attack.md) section of Wallarm Console, requests will not be blocked.

        From such event details, you can quickly block the bot with the **Add source IP to denylist** button. The IP is added to the denylist forever, but in the **IP Lists** section you can delete it or change the time of staying in the list.

    * **Denylist IP** or **Graylist IP** - the bot's IP is added to the corresponding list for the selected period, and requests are blocked. Learn more about the difference between deny- and graylist [here](../user-guides/ip-lists/overview.md).

1. If necessary change the detection **Sensitivity** for each bot type:
    
    * **Paranoid** - the higher sensitivity means that LESS bots access your applications, but this may block some legitimate requests due to false positives.
    * **Normal** (default, recommended) - uses optimal rules to avoid many false positives and prevent most malicious bot requests from reaching APIs.
    * **Safe mode** - the lower sensitivity means that MORE bots access your applications, but then no legitimate requests will be dropped.

        ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

1. Select application(s).
1. Set the **Analyze behavior by** parameter:

    * **Applications** - analyze requests to all of the domains of the application together.
    * **Domains** - analyze requests to each of the domains of the application separately.

<a name="per-profile-traffic"></a>Once created, profiles will protect your selected applications from the malicious bots of selected types. Note that protection and data analysis depend on profile's application traffic presence and amount. Pay your attention to the per-profile status:

![API abuse prevention - profiles](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-profiles-per-profile-status.png)

## Disabling and deleting profiles

Disabled profiles are the ones that the **API Abuse Prevention** module does not use during traffic analysis but that are still displayed in the profile list. You can re-enable disabled profiles at any moment. If there are no enabled profiles, the module does not block malicious bots.

Deleted profiles are the ones that cannot be restored and that the **API Abuse Prevention** module does not use during traffic analysis.

You can find **Disable** and **Delete** options in the profile menu.

## Exceptions

You can fine tune API Abuse Prevention by [making exceptions](exceptions.md): marking legitimate bots and disabling bot protection for particular target URLs and request types.

## Improving session mechanism

API Abuse Prevention uses the [API Sessions](../api-sessions/overview.md) mechanism when analyzing the bot behavior.

To make the API Abuse Prevention functionality more precise, it is recommended to enable [JA3 fingerprinting](../admin-en/enabling-ja3.md) for better identification of the the unauthenticated traffic when combining requests into sessions.
